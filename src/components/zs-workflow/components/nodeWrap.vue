<template>
  <div v-if="nodeConfig.type < 3" class="node-wrap">
    <!-- 节点卡片容器 -->
    <div
      class="node-wrap-box"
      :class="
        (nodeConfig.type == 0 ? 'start-node' : '') +
        (isTried && nodeConfig.error ? 'active error' : '')
      "
    >
      <!-- 头部标题栏：背景色区分节点类型 -->
      <div
        class="title"
        :style="`background: rgb(${bgColors[nodeConfig.type]});`"
      >
        <span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <!-- 起点节点直接展示名称，不可编辑 -->
          <!-- 审批/抄送：图标 + 可编辑标题 + 删除按钮 -->
          <span class="iconfont">{{ nodeConfig.type == 1 ? '睿' : '瞍' }}</span>
          <input
            v-if="isInput"
            :value="nodeConfig.nodeName"
            type="text"
            class="ant-input editable-title-input"
            :placeholder="defaultText"
            @blur="blurEvent()"
            @input="updateNodeName"
            @focus="($event.currentTarget as HTMLInputElement)?.select()"
          />
          <span v-else class="editable-title" @click="clickEvent()">
            {{ nodeConfig.nodeName }}
          </span>
          <i class="anticon anticon-close close" @click="delNode"></i>
        </template>
      </div>
      <!-- 内容区域：点击弹出选人弹窗 -->
      <div class="content" @click="() => setPerson()">
        <div class="text">
          <span v-if="!showText" class="placeholder">
            请选择{{ defaultText }}
          </span>
          {{ showText }}
        </div>
        <i class="anticon anticon-right arrow"></i>
      </div>
      <!-- 错误红点提示：表单校验失败展示感叹号 -->
      <div v-if="isTried && nodeConfig.error" class="error_tip">
        <i class="anticon anticon-exclamation-circle"></i>
      </div>
    </div>
    <!-- 添加下级节点 -->
    <addNode
      :child-node-p="(nodeConfig.childNode as NodeConfig | null)"
      @update:child-node-p="updateChildNode"
    />
  </div>
  <!-- 分支节点 -->
  <div v-if="nodeConfig.type == 4" class="branch-wrap">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="addTerm">添加条件</button>
        <div
          v-for="(item, index) in nodeConfig.conditionNodes"
          :key="index"
          class="col-box"
        >
          <div class="condition-node">
            <div class="condition-node-box">
              <div
                class="auto-judge"
                :class="[
                  isTried && item.error ? 'error active' : '',
                  isOtherCaseNode(item, index) ? 'other-case-node' : '',
                ]"
              >
                <div
                  v-if="index != 0 && !isOtherCaseNode(item, index)"
                  class="sort-left"
                  @click="arrTransfer(index, -1)"
                  >&lt;</div
                >
                <div class="title-wrapper">
                  <template v-if="isOtherCaseNode(item, index)">
                    <span class="editable-title">其他情况</span>
                    <span class="priority-title"
                      >优先级{{ item.priorityLevel }}</span
                    >
                  </template>
                  <template v-else>
                    <input
                      v-if="isInputList[index]"
                      v-model="item.nodeName"
                      type="text"
                      class="ant-input editable-title-input"
                      @blur="blurEvent(index)"
                      @focus="
                        ($event.currentTarget as HTMLInputElement)?.select()
                      "
                    />
                    <span
                      v-else
                      class="editable-title"
                      @click="clickEvent(index)"
                      >{{ item.nodeName }}</span
                    >
                    <span
                      class="priority-title"
                      @click="() => setPerson(item.priorityLevel)"
                      >优先级{{ item.priorityLevel }}</span
                    >
                  </template>
                  <i
                    class="anticon anticon-close close"
                    @click="delTerm(index)"
                  ></i>
                </div>
                <div
                  v-if="
                    index != nodeConfig.conditionNodes.length - 1 &&
                    !isOtherCaseNode(item, index)
                  "
                  class="sort-right"
                  @click="arrTransfer(index)"
                  >&gt;</div
                >
                <div
                  class="content"
                  @click="
                    !isOtherCaseNode(item, index) &&
                      setPerson(item.priorityLevel)
                  "
                >
                  <template v-if="isOtherCaseNode(item, index)">
                    不满足其他条件，进入此分支
                  </template>
                  <template v-else>
                    {{ $func.conditionStr(nodeConfig, index) }}
                  </template>
                </div>
                <div v-if="isTried && item.error" class="error_tip">
                  <i class="anticon anticon-exclamation-circle"></i>
                </div>
              </div>
              <addNode
                :child-node-p="item.childNode"
                @update:child-node-p="
                  (val) => updateConditionChildNode(index, val)
                "
              />
            </div>
          </div>
          <nodeWrap
            v-if="item.childNode"
            :node-config="item.childNode"
            @update:node-config="(val) => updateConditionChildNode(index, val)"
          />
          <template v-if="index == 0">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
          </template>
          <template v-if="index == nodeConfig.conditionNodes.length - 1">
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </template>
        </div>
      </div>
      <addNode
        :child-node-p="nodeConfig.childNode"
        @update:child-node-p="updateChildNode"
      />
    </div>
  </div>
  <!-- 递归渲染子节点 -->
  <nodeWrap
    v-if="nodeConfig.childNode"
    :node-config="nodeConfig.childNode"
    @update:node-config="updateChildNode"
  />
</template>

<script setup lang="ts">
  import {
    onMounted,
    ref,
    watch,
    getCurrentInstance,
    computed,
    type ComputedRef,
  } from 'vue';
  import $func from '../utils/index';
  import { useStore } from '../stores/index';
  import { bgColors, placeholderList } from '../utils/const';
  import {
    deepClone,
    createConditionNode,
    createOtherCaseNode,
    appendToLastChild,
  } from '../utils/nodeFactory';
  import type { NodeConfig, NodeUser } from '../types';
  import { NodeType } from '../types';
  import addNode from './addNode.vue';

  defineOptions({ name: 'NodeWrap' });

  const instance = getCurrentInstance();
  const uid = instance?.uid;

  const props = withDefaults(
    defineProps<{
      nodeConfig: NodeConfig;
      flowPermission?: NodeUser[];
      /** 发起人显示文本 */
      initiatorText?: string;
    }>(),
    {
      flowPermission: () => [],
    },
  );

  const emits = defineEmits<{
    'update:flowPermission': [value: NodeUser[]];
    'update:nodeConfig': [value: NodeConfig | null];
  }>();

  /** 合并部分字段后向父级 emit 更新 */
  const patchNode = (patch: Partial<NodeConfig>) => {
    emits('update:nodeConfig', {
      ...props.nodeConfig,
      ...patch,
    } as NodeConfig);
  };

  // 默认显示（根据不同类型显示节点类型文字）
  const defaultText = computed(() => {
    return placeholderList[props.nodeConfig.type];
  });

  // 根据不同类型显示节点类型文字
  const showText = computed(() => {
    if (props.nodeConfig.type === 0) {
      // 优先使用外部传入的发起人文本
      if (props.initiatorText) return props.initiatorText;
      return $func.arrToStr(props.flowPermission) || '所有人';
    }
    if (props.nodeConfig.type === 1)
      return $func.setApproverStr(props.nodeConfig);
    return $func.copyerStr(props.nodeConfig);
  });

  /** 判断条件节点是否为"其他情况"（else分支，不可设置条件） */
  const isOtherCaseNode = (item: any, index: number): boolean => {
    const conditionNodes = (props.nodeConfig as any).conditionNodes || [];
    const isLast = index === conditionNodes.length - 1;
    // 如果节点有 isOther 属性或者是"其他情况"名称，直接返回true
    if (item.isOther || item.nodeName === '其他情况') {
      return true;
    }
    // 否则根据规则判断
    const hasRules =
      (item.conditionRules && item.conditionRules.length > 0) ||
      (item.conditionList && item.conditionList.length > 0) ||
      item.expression ||
      item.conditionExpression;
    return (
      isLast &&
      !hasRules &&
      $func.hasPriorConditionRules(props.nodeConfig, index)
    );
  };

  // 输入框列表
  const isInputList = ref<boolean[]>([]);

  // 输入框输入事件
  const isInput = ref(false);
  // 条件分支
  const resetConditionNodesErr = () => {
    const conditionNodes = (props.nodeConfig as any).conditionNodes || [];
    const newConditionNodes = conditionNodes.map((item: any, i: number) => {
      return {
        ...item,
        error: $func.isConditionNodeError(props.nodeConfig, i),
      };
    });
    patchNode({ conditionNodes: newConditionNodes } as any);
  };

  onMounted(() => {
    if (props.nodeConfig.type === NodeType.APPROVER) {
      patchNode({ error: $func.isApproverNodeError(props.nodeConfig) } as any);
    } else if (props.nodeConfig.type === NodeType.CC) {
      patchNode({ error: $func.isCopyerNodeError(props.nodeConfig) } as any);
    } else if (props.nodeConfig.type === NodeType.ROUTER) {
      resetConditionNodesErr();
    }
  });

  // 处理条件节点内部子节点更新
  const updateConditionChildNode = (
    index: number,
    newChildNode: NodeConfig | null,
  ) => {
    const conditionNodes = (props.nodeConfig as any).conditionNodes || [];
    const newConditionNodes = [...conditionNodes];
    newConditionNodes[index] = {
      ...newConditionNodes[index],
      childNode: newChildNode,
    };
    patchNode({ conditionNodes: newConditionNodes } as any);
  };

  // 处理节点名称更新
  const updateNodeName = (e: Event) => {
    const target = e.target as HTMLInputElement;
    patchNode({ nodeName: target.value } as any);
  };

  // 处理子节点更新
  const updateChildNode = (newChildNode: NodeConfig | null) => {
    patchNode({ childNode: newChildNode } as any);
  };
  const store = useStore();
  const {
    setPromoter,
    setApprover,
    setCopyer,
    setCondition,
    setFlowPermission,
    setApproverConfig,
    setCopyerConfig,
    setConditionsConfig,
  } = store;
  const isTried = computed(() => store.isTried);
  const flowPermission1 = computed(() => store.flowPermission1);
  const approverConfig1 = computed(() => store.approverConfig1);
  const copyerConfig1 = computed(() => store.copyerConfig1);
  const conditionsConfig1 = computed(() => store.conditionsConfig1);

  /** 监听 store 配置变更，匹配 uid 后 emit 给父级 */
  const watchConfig = <
    T extends { flag: boolean; id: number | null; value: any },
  >(
    source: ComputedRef<T>,
    event: string,
  ) => {
    watch(source, (val) => {
      if (val.flag && val.id === uid) {
        emits(event as any, val.value!);
      }
    });
  };

  watchConfig(flowPermission1, 'update:flowPermission');
  watchConfig(approverConfig1, 'update:nodeConfig');
  watchConfig(copyerConfig1, 'update:nodeConfig');
  watchConfig(conditionsConfig1, 'update:nodeConfig');
  // 开启标题编辑
  const clickEvent = (index?: number) => {
    if (index !== undefined) {
      isInputList.value[index] = true;
    } else {
      isInput.value = true;
    }
  };
  // 输入框失焦兜底默认名称
  const blurEvent = (index?: number) => {
    if (index !== undefined) {
      isInputList.value[index] = false;
      const conditionNodes = (props.nodeConfig as any).conditionNodes || [];
      const newConditionNodes = conditionNodes.map((item: any, i: number) => {
        if (i === index) {
          return {
            ...item,
            nodeName: item.nodeName || '条件',
          };
        }
        return item;
      });
      patchNode({ conditionNodes: newConditionNodes } as any);
    } else {
      isInput.value = false;
      patchNode({
        nodeName: props.nodeConfig.nodeName || defaultText.value,
      } as any);
    }
  };

  // 删除当前节点
  const delNode = () => {
    emits('update:nodeConfig', props.nodeConfig.childNode || null);
  };
  // 新增条件分支
  const addTerm = () => {
    const currentNodes = (props.nodeConfig as any).conditionNodes || [];

    if (currentNodes.length === 0) {
      // 首次点击新增：默认创建两个子分支 - "条件1" 和 "其他情况"
      const conditionNode1 = createConditionNode(1);
      conditionNode1.nodeName = '条件1';
      const otherNode = createOtherCaseNode(2);
      const newConditionNodes = [conditionNode1, otherNode];
      patchNode({ conditionNodes: newConditionNodes } as any);
    } else {
      // 后续添加：计算当前条件数量（排除"其他情况"），生成条件N
      const conditionCount = currentNodes.filter(
        (n: any) => !n.isOther && n.nodeName !== '其他情况',
      ).length;
      const newNodeName = `条件${conditionCount + 1}`;
      const newConditionNode = createConditionNode(currentNodes.length + 1);
      newConditionNode.nodeName = newNodeName;

      // 检查是否存在"其他情况"节点
      const otherIndex = currentNodes.findIndex(
        (n: any) => n.isOther || n.nodeName === '其他情况',
      );

      let newConditionNodes;
      if (otherIndex > -1) {
        // 在"其他情况"前插入新条件
        newConditionNodes = [
          ...currentNodes.slice(0, otherIndex),
          newConditionNode,
          ...currentNodes.slice(otherIndex),
        ];
      } else {
        // 没有"其他情况"节点，创建一个新的并添加到末尾
        const otherNode = createOtherCaseNode(currentNodes.length + 2);
        newConditionNodes = [...currentNodes, newConditionNode, otherNode];
      }

      // 更新优先级，保留已有节点的自定义名称
      const updatedConditionNodes = newConditionNodes.map(
        (item: any, i: number) => {
          return {
            ...item,
            priorityLevel: i + 1,
          };
        },
      );
      patchNode({ conditionNodes: updatedConditionNodes } as any);
    }
  };
  // 删除单条条件
  const delTerm = (index: number) => {
    const conditionNodes = (props.nodeConfig as any).conditionNodes || [];

    // 先计算删除后的条件数量
    const remainingConditionNodes = conditionNodes.filter(
      (_: any, i: number) => i !== index,
    );
    const remainingCount = remainingConditionNodes.length;

    if (remainingCount <= 0) {
      // 删除后没有条件了，直接用条件分支后的节点替换
      emits('update:nodeConfig', props.nodeConfig.childNode || null);
      return;
    }

    if (remainingCount === 1) {
      // 删除后只剩1个条件，删除整个条件分支节点
      // 将剩余条件的子节点与条件分支后的节点合并
      const remainingCondition = remainingConditionNodes[0];
      const afterBranchNode = props.nodeConfig.childNode;

      if (remainingCondition && remainingCondition.childNode) {
        // 深拷贝剩余条件的子节点
        const remainingChild = deepClone(remainingCondition.childNode);
        // 将条件分支后面的节点接到剩余条件子节点的末尾
        appendToLastChild(remainingChild, afterBranchNode ?? null);
        emits('update:nodeConfig', remainingChild);
      } else {
        // 没有剩余条件的子节点，直接用条件分支后的节点
        emits('update:nodeConfig', afterBranchNode || null);
      }
      return;
    }

    // 正常删除条件（剩2个或更多条件）
    const draftConfig = {
      ...props.nodeConfig,
      conditionNodes: remainingConditionNodes,
    };
    const newConditionNodes = remainingConditionNodes.map(
      (item: any, i: number) => {
        // 最后一个节点如果没有配置规则，保持为"其他情况"
        const isLast = i === remainingConditionNodes.length - 1;
        const hasRules =
          (item.conditionRules && item.conditionRules.length > 0) ||
          (item.conditionList && item.conditionList.length > 0) ||
          item.expression ||
          item.conditionExpression;
        // 如果节点有 isOther 属性、名称是"其他情况"，或者符合其他情况的条件
        const isOtherCase =
          item.isOther ||
          item.nodeName === '其他情况' ||
          (isLast && !hasRules && $func.hasPriorConditionRules(draftConfig, i));

        let nodeName = `条件${i + 1}`;
        if (isOtherCase) {
          nodeName = '其他情况';
        } else if (item.nodeName && item.nodeName !== '其他情况') {
          nodeName = item.nodeName;
        }

        return {
          ...item,
          priorityLevel: i + 1,
          nodeName,
        };
      },
    );

    // 更新错误状态
    const tempConfig = {
      ...props.nodeConfig,
      conditionNodes: newConditionNodes,
    };
    const updatedWithErr = newConditionNodes.map((item: any, i: number) => ({
      ...item,
      error: $func.isConditionNodeError(tempConfig, i),
    }));

    patchNode({ conditionNodes: updatedWithErr } as any);
  };

  // 打开选人/条件弹窗
  const setPerson = (priorityLevel?: number) => {
    const { type } = props.nodeConfig;
    if (type === NodeType.INITIATOR) {
      setPromoter(true);
      setFlowPermission({
        value: props.flowPermission,
        flag: false,
        id: uid ?? null,
      });
    } else if (type === NodeType.APPROVER) {
      setApprover(true);
      setApproverConfig({
        value: {
          ...deepClone(props.nodeConfig),
          settype: props.nodeConfig.settype || 1,
        },
        flag: false,
        id: uid ?? null,
      });
    } else if (type === NodeType.CC) {
      setCopyer(true);
      setCopyerConfig({
        value: deepClone(props.nodeConfig),
        flag: false,
        id: uid ?? null,
      });
    } else {
      setCondition(true);
      setConditionsConfig({
        value: {
          ...deepClone(props.nodeConfig),
          priorityLevel: priorityLevel ?? 1,
        },
        flag: false,
        id: uid ?? null,
      });
    }
  };
  // 条件上下排序
  const arrTransfer = (index: number, type = 1) => {
    const conditionNodes = (props.nodeConfig as any).conditionNodes || [];
    const newConditionNodes = [...conditionNodes];
    const newIndex = index + type;

    // 边界检查
    if (
      newIndex < 0 ||
      newIndex >= newConditionNodes.length ||
      index < 0 ||
      index >= newConditionNodes.length
    ) {
      return;
    }

    // 不允许与"其他情况"节点交换位置
    const targetNode = newConditionNodes[newIndex];
    if (targetNode.isOther || targetNode.nodeName === '其他情况') {
      return;
    }

    // 使用数组解构交换元素位置
    [newConditionNodes[index], newConditionNodes[newIndex]] = [
      newConditionNodes[newIndex],
      newConditionNodes[index],
    ];

    // 只更新优先级，保留所有节点的自定义名称
    const updatedConditionNodes = newConditionNodes.map(
      (item: any, i: number) => {
        return {
          ...item,
          priorityLevel: i + 1,
        };
      },
    );

    patchNode({ conditionNodes: updatedConditionNodes } as any);
  };
</script>

<style>
  @import '../css/workflow.css';
  .error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
  }

  .selected_list {
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
  }

  .selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
  }

  /* 其他情况节点：复用 auto-judge 样式，仅禁用点击态 */
  .other-case-node {
    cursor: default;
  }
</style>
