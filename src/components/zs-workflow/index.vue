<template>
  <div class="zs-workflow">
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button>
        <div class="zoom">
          <div
            class="zoom-out"
            :class="nowVal == 50 && 'disabled'"
            @click="zoomSize(1)"
          ></div>
          <span>{{ nowVal }}%</span>
          <div
            class="zoom-in"
            :class="nowVal == 300 && 'disabled'"
            @click="zoomSize(2)"
          ></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${nowVal / 100});`">
          <nodeWrap
            v-model:node-config="nodeConfig"
            v-model:flow-permission="flowPermission"
            :initiator-text="props.initiatorText"
          />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer :initiator-text="props.initiatorText" />
    <approverDrawer :director-max-level="directorMaxLevel" />
    <copyerDrawer />
    <conditionDrawer />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { workflowApi } from './api/workflow';
  import { useStore } from './stores/index';
  import $func from './utils/index';
  import errorDialog from './components/dialog/errorDialog.vue';
  import promoterDrawer from './components/drawer/promoterDrawer.vue';
  import approverDrawer from './components/drawer/approverDrawer.vue';
  import copyerDrawer from './components/drawer/copyerDrawer.vue';
  import conditionDrawer from './components/drawer/conditionDrawer.vue';
  import nodeWrap from './components/nodeWrap.vue';
  import type {
    NodeConfig,
    ProcessConfig,
    FormField,
    RouterNode,
    ConditionNode,
  } from './types';

  const props = defineProps<{
    formFields?: FormField[];
    modelJson?: string;
    workflowName?: string;
    /** 发起人显示文本，如：所有人可以发起流程、XX可以发起流程 */
    initiatorText?: string;
  }>();

  const route = useRoute();
  const { setTableId, setIsTried, setFormFields } = useStore();

  const nowVal = ref(100);
  const nodeConfig = ref<NodeConfig>({
    nodeName: '发起人',
    type: 0,
    childNode: null,
  });
  const flowPermission = ref<Array<{ id: number; name: string }>>([]);

  const tipList = ref<Array<{ name: string; type: string; message?: string }>>(
    [],
  );

  const tipVisible = ref(false);
  const directorMaxLevel = ref(0);

  const processConfig = ref<ProcessConfig>({ flowPermission: [] });
  const workFlowDef = ref<{ name?: string; [key: string]: unknown }>({});

  // 缩放
  const zoomSize = (type: number) => {
    if (type === 1) {
      if (nowVal.value === 50) {
        return;
      }
      nowVal.value -= 10;
    } else {
      if (nowVal.value === 300) {
        return;
      }
      nowVal.value += 10;
    }
  };
  // 同步节点 error 标记（用于画布高亮）
  const syncNodeErrors = (
    node: NodeConfig | null | undefined,
  ): NodeConfig | null | undefined => {
    if (!node) return node;

    const next = { ...node } as NodeConfig;

    if (next.childNode) {
      next.childNode = syncNodeErrors(
        next.childNode as NodeConfig | null | undefined,
      ) as NodeConfig['childNode'];
    }

    if (next.type === 1) {
      next.error = $func.isApproverNodeError(next);
    } else if (next.type === 2) {
      next.error = $func.isCopyerNodeError(next);
    } else if (next.type === 4) {
      const routerNode = next as RouterNode;
      const conditionNodes = (routerNode.conditionNodes || []).map(
        (cond, index) => {
          const syncedCond = { ...cond };
          if (syncedCond.childNode) {
            syncedCond.childNode = syncNodeErrors(
              syncedCond.childNode as NodeConfig | null | undefined,
            ) as ConditionNode['childNode'];
          }
          syncedCond.error = $func.isConditionNodeError(routerNode, index);
          return syncedCond;
        },
      );
      (next as RouterNode).conditionNodes = conditionNodes;
    }

    return next;
  };

  // 错误提示 - 递归检查所有节点错误
  const collectErrors = ({
    childNode,
  }: {
    childNode: NodeConfig | null | undefined;
  }) => {
    if (!childNode) return;
    const { type, nodeName } = childNode;

    // 审批人节点
    if (type === 1) {
      const errMsg = $func.validateApprover(childNode);
      if (errMsg) {
        tipList.value.push({
          name: nodeName || '',
          type: '审批人',
          message: errMsg,
        });
      }
      collectErrors({
        childNode: childNode.childNode as NodeConfig | null | undefined,
      });
    }
    // 抄送人节点
    else if (type === 2) {
      const errMsg = $func.validateCopyer(childNode);
      if (errMsg) {
        tipList.value.push({
          name: nodeName || '',
          type: '抄送人',
          message: errMsg,
        });
      }
      collectErrors({
        childNode: childNode.childNode as NodeConfig | null | undefined,
      });
    }
    // 条件节点(type=3) - 递归检查其子节点
    else if (type === 3) {
      collectErrors({
        childNode: childNode.childNode as NodeConfig | null | undefined,
      });
    }
    // 条件分支(type=4)
    else if (type === 4) {
      const routerNode = childNode as RouterNode;
      const nodes = routerNode.conditionNodes || [];
      for (let i = 0; i < nodes.length; i += 1) {
        const errMsg = $func.validateCondition(routerNode, i);
        if (errMsg) {
          tipList.value.push({
            name: nodes[i]?.nodeName || '',
            type: '条件',
            message: errMsg,
          });
        }
        if (nodes[i]) {
          collectErrors({ childNode: nodes[i] });
        }
      }
      // 检查条件分支后面的节点
      collectErrors({
        childNode: childNode.childNode as NodeConfig | null | undefined,
      });
    }
    // 其他类型节点，继续往下
    else {
      collectErrors({
        childNode: childNode.childNode as NodeConfig | null | undefined,
      });
    }
  };

  // 校验流程配置
  const validateFlow = (): boolean => {
    setIsTried(true);
    tipList.value = [];

    // 同步 error 标记，便于画布展示
    nodeConfig.value = syncNodeErrors(nodeConfig.value) as NodeConfig;

    collectErrors({
      childNode: nodeConfig.value.childNode as NodeConfig | null | undefined,
    });
    if (tipList.value.length !== 0) {
      tipVisible.value = true;
      return false;
    }
    return true;
  };

  // 获取完整流程配置数据
  const getFlowData = () => {
    processConfig.value.flowPermission = flowPermission.value;
    processConfig.value.nodeConfig = nodeConfig.value;
    processConfig.value.workFlowDef = {
      ...workFlowDef.value,
      name: props.workflowName || workFlowDef.value.name || '',
    };
    processConfig.value.flowPermission = flowPermission.value;
    return { ...processConfig.value };
  };

  // 获取流程 JSON 字符串（用于保存到后端）
  const getModelJson = (): string => {
    const data = getFlowData();
    return JSON.stringify(data);
  };

  // 发布（内部使用）
  const saveSet = async () => {
    const valid = validateFlow();
    if (!valid) return;
    const data = getFlowData();
    try {
      const res = await workflowApi.saveModel(data);
      // eslint-disable-next-line no-console
      console.log(res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存失败:', error);
    }
  };

  // 暴露给父组件的方法
  defineExpose({
    validateFlow,
    getFlowData,
    getModelJson,
    saveSet,
  });
  onMounted(async () => {
    if (props.modelJson) {
      try {
        const data = JSON.parse(props.modelJson);
        processConfig.value = data;
        nodeConfig.value = data.nodeConfig || {
          nodeName: '发起人',
          type: 0,
          childNode: null,
        };
        flowPermission.value = data.flowPermission || [];
        directorMaxLevel.value = data.directorMaxLevel || 0;
        workFlowDef.value = data.workFlowDef || {};
        setTableId(data.tableId || 0);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('解析 modelJson 失败', e);
      }
    } else {
      try {
        const modelId = route.query.modelId as string;
        if (modelId) {
          const { data: res } = await workflowApi.getModelById(modelId);
          const result = res?.data ?? res;
          processConfig.value = result;
          const {
            nodeConfig: nodes,
            flowPermission: flows,
            directorMaxLevel: directors,
            workFlowDef: works,
            tableId,
          } = result;
          nodeConfig.value = nodes || {
            nodeName: '发起人',
            type: 0,
            childNode: null,
          };
          flowPermission.value = flows || [];
          directorMaxLevel.value = directors || 0;
          workFlowDef.value = works || {};
          setTableId(tableId || 0);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('获取流程模型失败:', error);
      }
    }
    if (props.formFields) {
      setFormFields(props.formFields);
    }
  });

  watch(
    () => props.formFields,
    (val) => {
      setFormFields(val ?? []);
    },
    { deep: true },
  );
</script>

<style lang="less" scoped>
  @import './css/workflow.css';
  .zs-workflow {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: var(--color-bg-1);
  }

  .fd-nav-content {
    height: 100%;
  }
</style>
