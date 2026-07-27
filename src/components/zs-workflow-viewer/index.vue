<template>
  <div class="zs-workflow-viewer">
    <div class="fd-nav-content">
      <section class="dingflow-design">
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
            :node-config="nodeConfig"
            :flow-permission="flowPermission"
            :initiator-text="props.initiatorText"
          />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { workflowApi } from '../zs-workflow/api/workflow';
  import { useStore } from '../zs-workflow/stores/index';
  import nodeWrap from '../zs-workflow/components/nodeWrap.vue';
  import type {
    NodeConfig,
    ProcessConfig,
    FormField,
  } from '../zs-workflow/types';

  const props = defineProps<{
    formFields?: FormField[];
    modelJson?: string;
    workflowName?: string;
    initiatorText?: string;
  }>();

  const route = useRoute();
  const { setTableId, setFormFields } = useStore();

  const nowVal = ref(100);
  const nodeConfig = ref<NodeConfig>({
    nodeName: '发起人',
    type: 0,
    childNode: null,
  });
  const flowPermission = ref<Array<{ id: number; name: string }>>([]);

  const directorMaxLevel = ref(0);

  const processConfig = ref<ProcessConfig>({ flowPermission: [] });
  const workFlowDef = ref<{ name?: string; [key: string]: unknown }>({});

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
  @import '../zs-workflow/css/workflow.css';
  .zs-workflow-viewer {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: var(--color-bg-1);
  }

  .fd-nav-content {
    height: 100%;
  }
</style>
