<template>
  <div class="branch-wrap">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="handleAddBranch">添加条件</button>
        <div class="col-box">
          <div
            v-for="(branch, index) in branches"
            :key="branch.id"
            class="condition-node"
          >
            <div class="condition-node-box">
              <div class="auto-judge">
                <div class="title-wrapper">
                  <span class="editable-title">{{ branch.name }}</span>
                  <span class="priority-title">优先级{{ index + 1 }}</span>
                  <i
                    class="anticon anticon-close close"
                    @click="handleDeleteBranch(index)"
                  ></i>
                </div>
                <div class="sort-right">&gt;</div>
                <div class="content">{{ branch.condition }}</div>
              </div>
              <div class="add-node-btn-box">
                <div class="add-node-btn">
                  <button class="btn" @click="handleAddNode(index)">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import LogicFlow from '@logicflow/core';

  const props = defineProps<{
    node: {
      id: string;
      x: number;
      y: number;
      properties?: {
        branches?: {
          id: string;
          name: string;
          condition: string;
        }[];
      };
    };
    graph: LogicFlow.GraphModel;
  }>();

  const emit = defineEmits<{
    (e: 'updateProperties', properties: any): void;
    (e: 'addNode', branchIndex: number): void;
  }>();

  const branches = computed(() => {
    return (
      props.node.properties?.branches || [
        { id: '1', name: '条件1', condition: '发起人属于：天旭' },
      ]
    );
  });

  const handleAddBranch = () => {
    const newBranches = [
      ...branches.value,
      {
        id: Date.now().toString(),
        name: `条件${branches.value.length + 1}`,
        condition: '请设置条件',
      },
    ];
    emit('updateProperties', { branches: newBranches });
  };

  const handleDeleteBranch = (index: number) => {
    const newBranches = branches.value.filter((_, i) => i !== index);
    emit('updateProperties', { branches: newBranches });
  };

  const handleAddNode = (branchIndex: number) => {
    emit('addNode', branchIndex);
  };
</script>

<style scoped>
  .branch-wrap {
    width: 100%;
    min-height: 80px;
  }

  .branch-box-wrap {
    display: flex;
    gap: 20px;
  }

  .branch-box {
    flex: 1;
  }

  .add-branch {
    margin-bottom: 12px;
    padding: 6px 12px;
    font-size: 12px;
    color: #666;
    background: #f5f5f5;
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-branch:hover {
    background: #eee;
    border-color: #ccc;
  }

  .col-box {
    display: flex;
    gap: 20px;
  }

  .condition-node {
    flex: 1;
  }

  .condition-node-box {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    min-width: 200px;
  }

  .auto-judge {
    padding: 10px 12px;
    background: #f4f4f5;
  }

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .editable-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .priority-title {
    font-size: 12px;
    color: #999;
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .close {
    cursor: pointer;
    font-size: 12px;
    color: #999;
    margin-left: auto;
    transition: color 0.2s;
  }

  .close:hover {
    color: #f56c6c;
  }

  .sort-right {
    font-size: 14px;
    color: #999;
    margin-bottom: 4px;
  }

  .content {
    font-size: 13px;
    color: #666;
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
</style>
