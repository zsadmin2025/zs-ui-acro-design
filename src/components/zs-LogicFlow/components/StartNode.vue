<template>
  <div class="node-wrap-box start-node">
    <div>
      <div class="title" :style="{ background: '#576A95' }">
        <span>{{ title }}</span>
      </div>
      <div class="content">
        <div class="text">{{ assignee }}</div>
        <i class="anticon anticon-right arrow"></i>
      </div>
    </div>
    <div class="add-node-btn-box">
      <div class="add-node-btn">
        <button class="btn" @click="showMenu = !showMenu">+</button>
        <div v-if="showMenu" class="add-node-popover">
          <a class="add-node-popover-item approver" @click="handleAddApprover">
            <div class="item-wrapper">
              <span>👤</span>
            </div>
            <p>审批人</p>
          </a>
          <a class="add-node-popover-item notifier" @click="handleAddNotifier">
            <div class="item-wrapper">
              <span>📢</span>
            </div>
            <p>抄送人</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="handleAddCondition"
          >
            <div class="item-wrapper">
              <span>🔀</span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, inject } from 'vue';
  import LogicFlow from '@logicflow/core';

  const props = defineProps<{
    node: {
      id: string;
      x: number;
      y: number;
      properties?: {
        title?: string;
        assignee?: string;
      };
    };
    graph: any;
  }>();

  const lf = inject<LogicFlow>('lf')!;

  const showMenu = ref(false);

  const title = computed(() => props.node.properties?.title || '发起人');
  const assignee = computed(() => props.node.properties?.assignee || '所有人');

  const handleAddApprover = () => {
    showMenu.value = false;
    const newNode = lf.addNode({
      id: `approver-${Date.now()}`,
      type: 'approver-node',
      x: props.node.x + 300,
      y: props.node.y,
      properties: {
        title: '审核人',
        assignee: '指定人员',
      },
    });
    lf.addEdge({
      sourceNodeId: props.node.id,
      targetNodeId: newNode.id,
    });
  };

  const handleAddNotifier = () => {
    showMenu.value = false;
    const newNode = lf.addNode({
      id: `notifier-${Date.now()}`,
      type: 'notifier-node',
      x: props.node.x + 300,
      y: props.node.y,
      properties: {
        title: '抄送人',
        assignee: '指定人员',
      },
    });
    lf.addEdge({
      sourceNodeId: props.node.id,
      targetNodeId: newNode.id,
    });
  };

  const handleAddCondition = () => {
    showMenu.value = false;
    const newNode = lf.addNode({
      id: `condition-${Date.now()}`,
      type: 'condition-node',
      x: props.node.x + 300,
      y: props.node.y,
      properties: {
        branches: [{ id: '1', name: '条件1', condition: '请设置条件' }],
      },
    });
    lf.addEdge({
      sourceNodeId: props.node.id,
      targetNodeId: newNode.id,
    });
  };
</script>

<style scoped>
  .node-wrap-box {
    position: relative;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: 200px;
  }

  .node-wrap-box.start-node .title {
    padding: 10px 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }

  .content {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text {
    font-size: 13px;
    color: #666;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    color: #ccc;
    font-size: 16px;
  }

  .add-node-btn-box {
    padding: 10px;
    display: flex;
    justify-content: center;
  }

  .add-node-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px dashed #ddd;
    background: #fff;
    color: #999;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:hover {
    border-color: #576a95;
    color: #576a95;
  }

  .add-node-popover {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: 8px;
    min-width: 120px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .add-node-popover-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
    color: #333;
  }

  .add-node-popover-item:hover {
    background: #f5f5f5;
  }

  .item-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .add-node-popover-item p {
    margin: 0;
    font-size: 13px;
  }
</style>
