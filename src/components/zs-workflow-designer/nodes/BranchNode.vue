<template>
  <div
    class="branch-node"
    :class="{
      'is-selected': selected,
      'is-condition': node.type === 'condition',
      'is-parallel': node.type === 'parallel',
    }"
    @click="handleClick"
  >
    <!-- 分支节点头部 -->
    <div class="branch-header">
      <div class="header-card">
        <div class="header-icon" :style="{ backgroundColor: nodeColor }">
          <icon-font :type="nodeIcon" :size="18" />
        </div>
        <span class="header-title">{{ node.name }}</span>
        <span class="header-badge">{{ branches.length }}个分支</span>
        <div v-if="showDelete" class="header-delete" @click.stop="handleDelete">
          <icon-close :size="12" />
        </div>
      </div>

      <!-- 添加条件按钮（仅条件分支显示） -->
      <div v-if="node.type === 'condition'" class="add-condition-btn">
        <a-button type="primary" size="small" @click.stop="handleAddCondition">
          <icon-plus :size="14" /> 添加条件
        </a-button>
      </div>
    </div>

    <!-- 头部连接线 -->
    <div class="branch-vertical-line">
      <div class="line-dot"></div>
    </div>

    <!-- 分支内容区域 -->
    <div class="branch-content">
      <!-- 分支列表 -->
      <div class="branch-list">
        <div
          v-for="(branch, index) in branches"
          :key="branch.id"
          class="branch-item"
        >
          <!-- 分支标签 -->
          <div class="branch-label">
            <div
              class="label-tag"
              :class="{
                'is-default':
                  index === branches.length - 1 && node.type === 'condition',
              }"
            >
              {{ branch.name }}
            </div>
          </div>

          <!-- 分支节点列表 -->
          <div class="branch-nodes">
            <template v-if="branch.nodes && branch.nodes.length > 0">
              <template
                v-for="(childNode, childIndex) in branch.nodes"
                :key="childNode.id"
              >
                <NodeCard
                  :node="childNode"
                  :selected="selectedNodeId === childNode.id"
                  @click="handleChildClick"
                  @delete="handleChildDelete"
                />
                <AddNodeButton
                  v-if="childNode.type !== 'end'"
                  @add="
                    (type) => handleAddChildNode(branch.id, childIndex, type)
                  "
                />
              </template>
            </template>

            <div v-else class="empty-branch">
              <span>点击添加节点</span>
            </div>

            <AddNodeButton
              v-if="!hasEndNode(branch.nodes)"
              @add="
                (type) =>
                  handleAddChildNode(branch.id, branch.nodes?.length || 0, type)
              "
            />
          </div>

          <!-- 分支底部连接线 -->
          <div class="branch-bottom-line">
            <div class="line-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 合并连接线 -->
    <div class="branch-merge-line">
      <div class="line-dot"></div>
    </div>

    <!-- 分支节点底部 -->
    <div class="branch-footer">
      <div class="footer-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { WorkflowNode, ConditionBranch, ParallelBranch } from '../types';
  import {
    getNodeIcon,
    getNodeColor,
    getNodeTypeConfig,
  } from '../config/nodeTypes';
  import { createNodeByType, generateId } from '../utils';
  import NodeCard from './NodeCard.vue';
  import AddNodeButton from './AddNodeButton.vue';

  const props = defineProps<{
    node: WorkflowNode;
    selected?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click', node: WorkflowNode): void;
    (e: 'delete', node: WorkflowNode): void;
  }>();

  const nodeIcon = computed(() => getNodeIcon(props.node.type));
  const nodeColor = computed(() => getNodeColor(props.node.type));
  const config = computed(() => getNodeTypeConfig(props.node.type));
  const showDelete = computed(() => config.value?.allowDelete ?? true);

  const selectedNodeId = ref<string | null>(null);

  // 获取分支列表
  const branches = computed<(ConditionBranch | ParallelBranch)[]>(() => {
    if ('branches' in props.node && props.node.branches) {
      return props.node.branches;
    }
    return [];
  });

  // 检查分支是否有结束节点
  function hasEndNode(nodes: WorkflowNode[] | undefined): boolean {
    if (!nodes || nodes.length === 0) return false;
    return nodes.some((n) => n.type === 'end');
  }

  function handleClick() {
    emit('click', props.node);
  }

  function handleDelete() {
    emit('delete', props.node);
  }

  function handleChildClick(childNode: WorkflowNode) {
    selectedNodeId.value = childNode.id;
    // 可以在这里触发父组件的选中事件
  }

  function handleChildDelete(childNode: WorkflowNode) {
    // 从对应分支中删除节点
    const branchNode = props.node as Extract<WorkflowNode, { branches: any[] }>;
    if (branchNode.branches) {
      branchNode.branches.forEach((branch) => {
        const index = branch.nodes.findIndex(
          (n: WorkflowNode) => n.id === childNode.id,
        );
        if (index > -1) {
          branch.nodes.splice(index, 1);
        }
      });
    }
  }

  function handleAddChildNode(branchId: string, index: number, type: string) {
    const branchNode = props.node as Extract<WorkflowNode, { branches: any[] }>;
    const branch = branchNode.branches?.find((b) => b.id === branchId);
    if (branch) {
      const newNode = createNodeByType(type as any);
      if (newNode) {
        if (!branch.nodes) branch.nodes = [];
        branch.nodes.splice(index + 1, 0, newNode);
      }
    }
  }

  function handleAddCondition() {
    const branchNode = props.node as Extract<WorkflowNode, { branches: any[] }>;
    if (!branchNode.branches) branchNode.branches = [];
    const branchCount = branchNode.branches.length;
    branchNode.branches.splice(branchCount - 1, 0, {
      id: generateId('branch_'),
      name: `条件${branchCount}`,
      conditions: [],
      nodes: [],
    });
    if (branchNode.branches[branchCount - 1]) {
      branchNode.branches[branchCount - 1].name = '其他条件';
    }
  }
</script>

<style lang="less" scoped>
  .branch-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px;

    &.is-selected {
      .branch-header .header-card {
        border-color: #3370ff;
        box-shadow: 0 0 0 2px rgba(51, 112, 255, 0.15),
          0 4px 16px rgba(0, 0, 0, 0.12);
      }
    }

    .branch-header {
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .header-card {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px 20px;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #e5e6eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-color: #c9cdd4;
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #fff;
          margin-right: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
        }

        .header-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2329;
        }

        .header-badge {
          margin-left: 10px;
          padding: 2px 8px;
          background: #f0f2f5;
          border-radius: 10px;
          font-size: 12px;
          color: #8f959e;
          font-weight: 500;
        }

        .header-delete {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f54a45;
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(245, 74, 69, 0.3);

          &:hover {
            background: #d93a35;
            transform: scale(1.1);
          }
        }

        &:hover .header-delete {
          opacity: 1;
        }
      }
    }

    .branch-vertical-line {
      width: 2px;
      height: 20px;
      background: #c9cdd4;
      position: relative;

      .line-dot {
        position: absolute;
        bottom: -3px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: #c9cdd4;
        border-radius: 50%;
      }
    }

    .branch-content {
      display: flex;
      align-items: flex-start;
      position: relative;
      width: 100%;
      justify-content: center;

      .branch-list {
        display: flex;
        gap: 32px;
        padding: 0 16px;

        .branch-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 280px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 24px;
            background: #c9cdd4;
          }

          .branch-label {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            position: relative;

            .label-tag {
              display: flex;
              align-items: center;
              padding: 6px 14px;
              background: #fff;
              border: 1px solid #e5e6eb;
              border-radius: 16px;
              font-size: 12px;
              color: #4e5969;
              font-weight: 500;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

              &::before {
                content: '';
                width: 6px;
                height: 6px;
                background: #3370ff;
                border-radius: 50%;
                margin-right: 6px;
              }

              &.is-default {
                background: #f7f8fa;
                color: #8f959e;
                border-color: #e5e6eb;

                &::before {
                  background: #c9cdd4;
                }
              }
            }
          }

          .branch-nodes {
            display: flex;
            flex-direction: column;
            align-items: center;

            .empty-branch {
              padding: 20px 32px;
              color: #8f959e;
              font-size: 12px;
              border: 1px dashed #d9dde3;
              border-radius: 6px;
              margin: 8px 0;
              background: #fff;
            }
          }

          .branch-bottom-line {
            width: 2px;
            height: 24px;
            background: #c9cdd4;
            position: relative;

            .line-dot {
              position: absolute;
              bottom: -3px;
              left: 50%;
              transform: translateX(-50%);
              width: 8px;
              height: 8px;
              background: #c9cdd4;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .branch-merge-line {
      width: 100%;
      height: 24px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 20px;
        background: #c9cdd4;
      }

      .line-dot {
        position: absolute;
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: #c9cdd4;
        border-radius: 50%;
      }
    }

    .branch-footer {
      margin-top: 0;

      .footer-line {
        width: 2px;
        height: 20px;
        background: #c9cdd4;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: #c9cdd4;
          border-radius: 50%;
        }
      }
    }

    &.is-condition {
      .branch-header .header-icon {
        background: #ff6a00;
      }

      .branch-label .label-tag::before {
        background: #ff6a00;
      }
    }

    &.is-parallel {
      .branch-header .header-icon {
        background: #00b96b;
      }

      .branch-label .label-tag::before {
        background: #00b96b;
      }
    }
  }
</style>
