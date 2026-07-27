<template>
  <div class="workflow-designer">
    <!-- 顶部工具栏 -->
    <div class="designer-toolbar">
      <div class="toolbar-left">
        <a-space>
          <a-button type="primary" @click="handleSave">
            <template #icon><icon-save /></template>
            保存
          </a-button>
          <a-button @click="handlePreview">
            <template #icon><icon-eye /></template>
            预览
          </a-button>
          <a-button @click="handleValidate">
            <template #icon><icon-check-circle /></template>
            校验
          </a-button>
        </a-space>
      </div>
      <div class="toolbar-center">
        <span class="workflow-name">{{ workflowName }}</span>
      </div>
      <div class="toolbar-right">
        <a-space>
          <a-tooltip content="撤销">
            <a-button type="text" :disabled="!canUndo" @click="handleUndo">
              <template #icon><icon-undo /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="重做">
            <a-button type="text" :disabled="!canRedo" @click="handleRedo">
              <template #icon><icon-redo /></template>
            </a-button>
          </a-tooltip>
          <a-divider direction="vertical" />
          <a-tooltip content="清空">
            <a-button type="text" status="danger" @click="handleClear">
              <template #icon><icon-delete /></template>
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <div class="designer-body">
      <!-- 左侧节点面板 -->
      <div class="node-panel">
        <div class="panel-title">节点组件</div>
        <div class="panel-content">
          <div
            v-for="item in draggableNodeTypes"
            :key="item.type"
            class="node-item"
            draggable="true"
            @dragstart="handleDragStart($event, item.type)"
          >
            <div class="node-icon" :style="{ backgroundColor: item.color }">
              <icon-font :type="item.icon" :size="16" />
            </div>
            <span class="node-name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- 画布区域 -->
      <div
        class="designer-canvas"
        @drop="handleDrop"
        @dragover.prevent
        @click="handleCanvasClick"
      >
        <div class="canvas-content">
          <!-- 空状态 -->
          <div v-if="nodes.length === 0" class="empty-state">
            <icon-plus class="empty-icon" />
            <span>拖拽左侧节点到此处开始设计</span>
          </div>

          <!-- 渲染节点列表 -->
          <template v-else>
            <template v-for="(node, index) in nodes" :key="node.id">
              <!-- 节点卡片 -->
              <NodeCard
                :node="node"
                :selected="selectedNodeId === node.id"
                @click="handleNodeClick"
                @delete="handleNodeDelete"
              />

              <!-- 添加节点按钮（非结束节点后） -->
              <AddNodeButton
                v-if="node.type !== 'end'"
                @add="(type) => handleAddNode(index, type)"
              />
            </template>
          </template>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <transition name="slide">
        <div v-if="selectedNode" class="property-panel">
          <div class="panel-header">
            <span class="panel-title">节点设置</span>
            <icon-close class="panel-close" @click="selectedNodeId = null" />
          </div>
          <div class="panel-content">
            <NodePropertyPanel
              :node="selectedNode"
              @update="handleNodeUpdate"
            />
          </div>
        </div>
      </transition>
    </div>

    <!-- 校验结果弹窗 -->
    <a-modal
      v-model:visible="validateModalVisible"
      title="流程校验结果"
      :footer="false"
      width="400px"
    >
      <div class="validate-result">
        <div v-if="validateResult.valid" class="result-success">
          <icon-check-circle class="result-icon" />
          <span>流程校验通过！</span>
        </div>
        <div v-else class="result-error">
          <icon-close-circle class="result-icon" />
          <div class="error-list">
            <div
              v-for="(error, index) in validateResult.errors"
              :key="index"
              class="error-item"
            >
              {{ index + 1 }}. {{ error }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 预览弹窗 -->
    <a-modal
      v-model:visible="previewModalVisible"
      title="流程预览"
      :footer="false"
      width="600px"
      :body-style="{ padding: '20px' }"
    >
      <pre class="preview-content">{{ previewContent }}</pre>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import type { WorkflowNode, NodeType, WorkflowDefinition } from './types';
  import { createStartNode, createEndNode, createNodeByType } from './utils';
  import { nodeTypeConfigs } from './config/nodeTypes';
  import NodeCard from './nodes/NodeCard.vue';
  import AddNodeButton from './nodes/AddNodeButton.vue';
  import NodePropertyPanel from './panels/NodePropertyPanel.vue';

  const props = defineProps<{
    modelValue?: WorkflowDefinition;
    workflowName?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: WorkflowDefinition): void;
    (e: 'change', nodes: WorkflowNode[]): void;
    (e: 'save', data: WorkflowDefinition): void;
  }>();

  // 节点列表
  const nodes = ref<WorkflowNode[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const validateModalVisible = ref(false);
  const previewModalVisible = ref(false);
  const previewContent = ref('');

  // 历史记录（用于撤销/重做）
  const history = ref<WorkflowNode[][]>([]);
  const historyIndex = ref(-1);

  // 是否可以撤销/重做
  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  // 当前选中的节点
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null;
    return nodes.value.find((n) => n.id === selectedNodeId.value) || null;
  });

  // 校验结果
  const validateResult = ref<{ valid: boolean; errors: string[] }>({
    valid: true,
    errors: [],
  });

  // 可拖拽的节点类型（排除开始和结束）
  const draggableNodeTypes = computed(() =>
    nodeTypeConfigs.filter((config) => config.allowAdd),
  );

  // 保存到历史记录
  function saveToHistory() {
    history.value = history.value.slice(0, historyIndex.value + 1);
    history.value.push(JSON.parse(JSON.stringify(nodes.value)));
    historyIndex.value += 1;
  }

  // 初始化默认流程
  function initDefaultWorkflow() {
    nodes.value = [createStartNode(), createEndNode()];
    saveToHistory();
  }

  // 撤销
  function handleUndo() {
    if (canUndo.value) {
      historyIndex.value -= 1;
      nodes.value = JSON.parse(
        JSON.stringify(history.value[historyIndex.value]),
      );
      selectedNodeId.value = null;
    }
  }

  // 重做
  function handleRedo() {
    if (canRedo.value) {
      historyIndex.value += 1;
      nodes.value = JSON.parse(
        JSON.stringify(history.value[historyIndex.value]),
      );
      selectedNodeId.value = null;
    }
  }

  // 监听外部数据变化
  watch(
    () => props.modelValue,
    (val) => {
      if (val?.nodes && val.nodes.length > 0) {
        nodes.value = val.nodes;
        saveToHistory();
      } else {
        initDefaultWorkflow();
      }
    },
    { immediate: true },
  );

  // 监听节点变化，触发更新
  watch(
    nodes,
    (val) => {
      emit('change', val);
      if (props.modelValue) {
        emit('update:modelValue', {
          ...props.modelValue,
          nodes: val,
        });
      }
    },
    { deep: true },
  );

  // 拖拽开始
  function handleDragStart(event: DragEvent, type: NodeType) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('nodeType', type);
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  // 放置节点
  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer?.getData('nodeType') as NodeType;
    if (type) {
      // 如果画布为空，需要同时添加开始和结束节点
      if (nodes.value.length === 0) {
        const startNode = createStartNode();
        const newNode = createNodeByType(type);
        const endNode = createEndNode();
        if (newNode) {
          nodes.value = [startNode, newNode, endNode];
          saveToHistory();
        }
      } else {
        // 在末尾添加节点（在结束节点之前）
        const newNode = createNodeByType(type);
        if (newNode) {
          const endIndex = nodes.value.findIndex((n) => n.type === 'end');
          const insertIndex = endIndex >= 0 ? endIndex : nodes.value.length;
          nodes.value.splice(insertIndex, 0, newNode);
          saveToHistory();
        }
      }
    }
  }

  // 点击画布空白处取消选中
  function handleCanvasClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      selectedNodeId.value = null;
    }
  }

  // 点击节点
  function handleNodeClick(node: WorkflowNode) {
    selectedNodeId.value = node.id;
  }

  // 删除节点
  function handleNodeDelete(node: WorkflowNode) {
    const index = nodes.value.findIndex((n) => n.id === node.id);
    if (index > -1) {
      nodes.value.splice(index, 1);
      saveToHistory();
    }
    if (selectedNodeId.value === node.id) {
      selectedNodeId.value = null;
    }
  }

  // 添加节点
  function handleAddNode(index: number, type: NodeType) {
    const newNode = createNodeByType(type);
    if (newNode) {
      nodes.value.splice(index + 1, 0, newNode);
      saveToHistory();
    }
  }

  // 更新节点
  function handleNodeUpdate(updatedNode: WorkflowNode) {
    const index = nodes.value.findIndex((n) => n.id === updatedNode.id);
    if (index > -1) {
      nodes.value[index] = updatedNode;
    }
  }

  // 生成ID
  function generateId(prefix: string = ''): string {
    return `${prefix}${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substr(2, 5)}`;
  }

  // 校验流程
  function validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const hasStart = nodes.value.some((n) => n.type === 'start');
    if (!hasStart) errors.push('缺少发起人节点');

    const hasEnd = nodes.value.some((n) => n.type === 'end');
    if (!hasEnd) errors.push('缺少结束节点');

    nodes.value.forEach((node) => {
      if (node.type === 'approver') {
        const approverNode = node as Extract<
          WorkflowNode,
          { type: 'approver' }
        >;
        if (
          !approverNode.approvers?.values?.length &&
          approverNode.approvers?.source !== 'leader'
        ) {
          errors.push(`审批节点"${node.name}"未配置审批人`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  // 保存
  function handleSave() {
    const result = validate();
    if (!result.valid) {
      validateResult.value = result;
      validateModalVisible.value = true;
      return;
    }

    const data: WorkflowDefinition = {
      id: props.modelValue?.id || generateId('wf_'),
      name: props.workflowName || '未命名流程',
      version: props.modelValue?.version || 1,
      nodes: nodes.value,
    };

    emit('save', data);
    Message.success('保存成功');
  }

  // 预览
  function handlePreview() {
    previewContent.value = JSON.stringify(
      {
        name: props.workflowName || '未命名流程',
        nodes: nodes.value,
      },
      null,
      2,
    );
    previewModalVisible.value = true;
  }

  // 校验
  function handleValidate() {
    validateResult.value = validate();
    validateModalVisible.value = true;
  }

  // 清空
  function handleClear() {
    nodes.value = [];
    selectedNodeId.value = null;
    saveToHistory();
  }

  // 获取流程数据
  function getWorkflowData(): WorkflowNode[] {
    return nodes.value;
  }

  defineExpose({
    getWorkflowData,
    validate,
  });
</script>

<style lang="less" scoped>
  .workflow-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f6f7;

    .designer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
      padding: 0 16px;
      background: #fff;
      border-bottom: 1px solid #e5e6eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

      .toolbar-center {
        .workflow-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2329;
        }
      }
    }

    .designer-body {
      display: flex;
      flex: 1;
      overflow: hidden;

      .node-panel {
        width: 180px;
        background: #fff;
        border-right: 1px solid #e5e6eb;
        display: flex;
        flex-direction: column;

        .panel-title {
          padding: 14px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #1f2329;
          border-bottom: 1px solid #f0f1f5;
          background: #fafbfc;
        }

        .panel-content {
          flex: 1;
          overflow: auto;
          padding: 12px;

          .node-item {
            display: flex;
            align-items: center;
            padding: 8px 10px;
            margin-bottom: 6px;
            background: #f7f8fa;
            border-radius: 6px;
            cursor: grab;
            transition: all 0.2s ease;

            &:hover {
              background: #eef1f5;
              transform: translateX(4px);
            }

            &:active {
              cursor: grabbing;
            }

            .node-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              color: #fff;
              flex-shrink: 0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .node-name {
              margin-left: 10px;
              font-size: 13px;
              color: #4e5969;
              font-weight: 500;
            }
          }
        }
      }

      .designer-canvas {
        flex: 1;
        overflow: auto;
        padding: 30px 20px;
        background: #fff;
        background-image: linear-gradient(#f0f1f5 1px, transparent 1px),
          linear-gradient(90deg, #f0f1f5 1px, transparent 1px);
        background-size: 20px 20px;

        .canvas-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100%;

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px;
            color: #8f959e;

            .empty-icon {
              font-size: 56px;
              margin-bottom: 16px;
              color: #d9dde3;
            }
          }
        }
      }

      .property-panel {
        width: 360px;
        background: #fff;
        border-left: 1px solid #e5e6eb;
        display: flex;
        flex-direction: column;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #f0f1f5;
          background: #fafbfc;

          .panel-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2329;
          }

          .panel-close {
            font-size: 16px;
            color: #8f959e;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;

            &:hover {
              color: #1f2329;
              background: #f2f3f5;
            }
          }
        }

        .panel-content {
          flex: 1;
          overflow: auto;
          padding: 16px;
        }
      }
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  .validate-result {
    padding: 20px;

    .result-success,
    .result-error {
      display: flex;
      align-items: center;
      font-size: 14px;

      .result-icon {
        font-size: 24px;
        margin-right: 12px;
      }
    }

    .result-success {
      color: #00b96b;
    }

    .result-error {
      color: #f54a45;
      align-items: flex-start;

      .error-list {
        .error-item {
          margin-bottom: 8px;
          line-height: 1.5;
        }
      }
    }
  }

  .preview-content {
    max-height: 400px;
    overflow: auto;
    background: #f7f8fa;
    padding: 16px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.6;
  }
</style>
