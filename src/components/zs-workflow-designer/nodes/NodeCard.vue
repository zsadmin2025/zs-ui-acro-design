<template>
  <div
    class="workflow-node-wrapper"
    :class="{
      'is-selected': selected,
    }"
  >
    <!-- 条件分支特殊布局 -->
    <template v-if="node.type === 'condition' || node.type === 'parallel'">
      <BranchNode
        :node="node"
        :selected="selected"
        @click="handleClick"
        @delete="handleDelete"
      />
    </template>

    <!-- 普通节点 -->
    <template v-else>
      <div
        class="workflow-node"
        :class="{
          [`is-${node.type}`]: true,
        }"
        @click="handleClick"
      >
        <div
          class="node-card"
          :style="{ borderColor: selected ? nodeColor : 'transparent' }"
        >
          <!-- 节点图标 -->
          <div class="node-icon" :style="{ backgroundColor: nodeColor }">
            <icon-font :type="nodeIcon" :size="20" />
          </div>

          <!-- 节点内容 -->
          <div class="node-content">
            <div class="node-title">{{ node.name }}</div>
            <div class="node-desc">{{ nodeBrief }}</div>
          </div>

          <!-- 节点状态/设置标识 -->
          <div v-if="showSettingsIndicator" class="node-indicator">
            <icon-settings :size="14" />
          </div>

          <!-- 删除按钮 -->
          <div v-if="showDelete" class="node-delete" @click.stop="handleDelete">
            <icon-close :size="14" />
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="hasError" class="node-error-tip">
          <icon-exclamation-circle :size="14" />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { WorkflowNode } from '../types';
  import {
    getNodeIcon,
    getNodeColor,
    getNodeTypeConfig,
  } from '../config/nodeTypes';
  import { getNodeBrief, getNodeErrors } from '../utils';
  import BranchNode from './BranchNode.vue';

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
  const nodeBrief = computed(() => getNodeBrief(props.node));

  const config = computed(() => getNodeTypeConfig(props.node.type));

  const showDelete = computed(() => {
    return config.value?.allowDelete ?? true;
  });

  // 是否显示设置标识（节点已配置）
  const showSettingsIndicator = computed(() => {
    if (props.node.type === 'start' || props.node.type === 'end') {
      return false;
    }
    return true;
  });

  // 节点错误检查
  const nodeErrors = computed(() => getNodeErrors(props.node));
  const hasError = computed(() => nodeErrors.value.length > 0);
  const errorMessage = computed(() => nodeErrors.value[0] || '');

  function handleClick() {
    emit('click', props.node);
  }

  function handleDelete() {
    emit('delete', props.node);
  }
</script>

<style lang="less" scoped>
  .workflow-node-wrapper {
    position: relative;

    &.is-selected {
      .workflow-node .node-card {
        border-color: #3370ff;
        box-shadow: 0 0 0 2px rgba(51, 112, 255, 0.15),
          0 4px 16px rgba(0, 0, 0, 0.12);
      }
    }
  }

  .workflow-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px;

    .node-card {
      position: relative;
      display: flex;
      align-items: center;
      width: 280px;
      padding: 16px;
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

      .node-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: #fff;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      }

      .node-content {
        flex: 1;
        margin-left: 12px;
        overflow: hidden;

        .node-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2329;
          line-height: 20px;
        }

        .node-desc {
          font-size: 12px;
          color: #8f959e;
          line-height: 18px;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .node-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        color: #8f959e;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background: #f0f2f5;
          color: #3370ff;
        }
      }

      .node-delete {
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

      &:hover .node-delete {
        opacity: 1;
      }
    }

    .node-error-tip {
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding: 8px 14px;
      background: #fff5f5;
      border: 1px solid #ffd6d6;
      border-radius: 6px;
      color: #f54a45;
      font-size: 12px;

      svg {
        margin-right: 8px;
        flex-shrink: 0;
      }
    }

    &.is-start {
      .node-card {
        background: #3370ff;
        border-color: #3370ff;

        .node-icon {
          background: rgba(255, 255, 255, 0.25) !important;
        }

        .node-content {
          .node-title {
            color: #fff;
          }

          .node-desc {
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .node-indicator {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    &.is-end {
      .node-card {
        background: #f54a45;
        border-color: #f54a45;

        .node-icon {
          background: rgba(255, 255, 255, 0.25) !important;
        }

        .node-content {
          .node-title {
            color: #fff;
          }

          .node-desc {
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .node-indicator {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    &.is-approver {
      .node-card {
        .node-icon {
          background: #ff9f00;
        }
      }
    }

    &.is-handler {
      .node-card {
        .node-icon {
          background: #00b96b;
        }
      }
    }

    &.is-cc {
      .node-card {
        .node-icon {
          background: #8f959e;
        }
      }
    }

    &.is-delay {
      .node-card {
        .node-icon {
          background: #8f959e;
        }
      }
    }

    &.is-trigger {
      .node-card {
        .node-icon {
          background: #722ed1;
        }
      }
    }
  }
</style>
