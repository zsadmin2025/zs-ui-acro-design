<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <a-popover
        v-model:visible="visible"
        trigger="click"
        position="rt"
        width="auto"
      >
        <button class="btn" type="button">
          <icon-plus />
        </button>
        <template #content>
          <div class="add-node-popover-body">
            <div class="popover-content">
              <a-grid
                :cols="1"
                :col-gap="12"
                :row-gap="16"
                class="grid-demo-grid"
              >
                <a-grid-item
                  v-for="item in nodeList"
                  :key="item.type"
                  class="add-node-popover-item"
                  :class="item.class"
                  @click="addType(item.type)"
                >
                  <div class="item-icon">
                    <component :is="item.icon" />
                  </div>
                  <div class="item-info">
                    <p class="item-title">{{ item.title }}</p>
                    <p class="item-desc">{{ item.desc }}</p>
                  </div>
                </a-grid-item>
              </a-grid>
            </div>
          </div>
        </template>
      </a-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    IconPlus,
    IconCheckCircle,
    IconSend,
    IconBranch,
  } from '@arco-design/web-vue/es/icon';
  import {
    createApproverNode,
    createCCNode,
    createRouterNode,
  } from '../utils/nodeFactory';
  import type { NodeConfig } from '../types';

  const props = defineProps<{
    childNodeP?: NodeConfig | null;
  }>();

  const emits = defineEmits<{
    'update:childNodeP': [value: NodeConfig | null];
  }>();

  const visible = ref(false);

  interface NodeTypeItem {
    type: number;
    title: string;
    desc: string;
    icon: typeof IconCheckCircle;
    class: string;
  }

  const nodeList: NodeTypeItem[] = [
    {
      type: 1,
      title: '审批人',
      desc: '需要审批人审批',
      icon: IconCheckCircle,
      class: 'approver',
    },
    {
      type: 2,
      title: '抄送人',
      desc: '通知相关人员',
      icon: IconSend,
      class: 'notifier',
    },
    {
      type: 4,
      title: '条件分支',
      desc: '根据不同条件走不同流程',
      icon: IconBranch,
      class: 'condition',
    },
  ];

  const addType = (type: number) => {
    visible.value = false;
    const childNode = props.childNodeP ?? null;

    if (type === 1) {
      emits('update:childNodeP', createApproverNode(childNode));
    } else if (type === 2) {
      emits('update:childNodeP', createCCNode(childNode));
    } else if (type === 4) {
      emits('update:childNodeP', createRouterNode(childNode));
    }
  };
</script>

<style scoped lang="less">
  .add-node-btn-box {
    width: 240px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #cacaca;
    }
    .add-node-btn {
      user-select: none;
      width: 240px;
      padding: 20px 0 32px;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
      flex-shrink: 0;
      -webkit-box-flex: 1;
      flex-grow: 1;
      .btn {
        outline: none;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        width: 30px;
        height: 30px;
        background: #3296fa;
        border-radius: 50%;
        position: relative;
        border: none;
        line-height: 30px;
        -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        :deep(.arco-icon) {
          color: #fff;
          font-size: 16px;
        }
        &:hover {
          transform: scale(1.3);
          box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
        }
        &:active {
          transform: none;
          background: #1e83e9;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
</style>

<style lang="less">
  .add-node-popover-body {
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
    .popover-content {
      max-height: 400px;
      overflow-y: auto;
    }
    .add-node-popover-item {
      display: flex;
      align-items: center;
      padding: 7px 10px;
      cursor: pointer;
      background: #fff;
      border-bottom: 1px solid #f5f5f5;
      transition: background-color 0.2s ease;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background: #f5f5f5;
      }
      .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0px;
        flex-shrink: 0;
        .arco-icon {
          font-size: 20px;
          color: #fff;
        }
      }
      .item-info {
        flex: 1;
        min-width: 0;
        .item-title {
          font-size: 14px;
          font-weight: 500;
          color: #191f25;
        }
        .item-desc {
          font-size: 12px;
          color: #999;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &.approver {
        .item-icon {
          background: #ff943e;
        }
      }
      &.notifier {
        .item-icon {
          background: #3296fa;
        }
      }
      &.condition {
        .item-icon {
          background: #9b59b6;
        }
      }
      &.handler {
        .item-icon {
          background: #15bc83;
        }
      }
      &.parallel {
        .item-icon {
          background: #3498db;
        }
      }
      &.delayer {
        .item-icon {
          background: #95a5a6;
        }
      }
      &.trigger {
        .item-icon {
          background: #e74c3c;
        }
      }
    }
  }
</style>
