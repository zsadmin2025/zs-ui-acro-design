<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 16:05:54
 * @FilePath: /Workflow-Vue3/src/components/dialog/errorDialog.vue
-->
<template>
  <a-modal v-model:visible="visibleDialog" title="提示" :width="520">
    <div class="error-dialog-body">
      <div class="error-dialog-icon">
        <icon-close-circle style="color: #f53f3f; font-size: 22px" />
      </div>
      <div class="error-dialog-main">
        <div class="error-dialog-title">当前无法发布</div>
        <div class="error-dialog-content">
          <p class="error-dialog-desc">以下内容不完善，需进行修改</p>
          <div class="error-dialog-list">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="error-dialog-item"
            >
              <div
                class="error-dialog-item-tag"
                :class="getTagClass(item.type)"
              >
                {{ item.type }}
              </div>
              <div class="error-dialog-item-info">
                <span class="error-dialog-item-name">{{ item.name }}</span>
                <span class="error-dialog-item-msg">{{
                  item.message || `未选择${item.type}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button @click="visibleDialog = false">我知道了</a-button>
      <a-button type="primary" @click="visibleDialog = false"
        >前往修改</a-button
      >
    </template>
  </a-modal>
</template>

<script setup>
  import { computed } from 'vue';
  import { IconCloseCircle } from '@arco-design/web-vue/es/icon';

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['update:visible']);

  const visibleDialog = computed({
    get() {
      return props.visible;
    },
    set(val) {
      emits('update:visible', val);
    },
  });

  /** 根据错误类型返回标签样式类 */
  function getTagClass(type) {
    const classMap = {
      发起人: 'tag-initiator',
      审批人: 'tag-approver',
      抄送人: 'tag-cc',
      条件: 'tag-condition',
    };
    return classMap[type] || 'tag-default';
  }
</script>

<style scoped>
  .error-dialog-body {
    display: flex;
    align-items: flex-start;
  }

  .error-dialog-icon {
    margin-right: 16px;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .error-dialog-main {
    flex: 1;
  }

  .error-dialog-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .error-dialog-content {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .error-dialog-desc {
    margin: 0 0 12px;
    color: #86909c;
    font-size: 13px;
  }

  .error-dialog-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .error-dialog-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: #f7f8fa;
    border-radius: 4px;
    border-left: 3px solid #f53f3f;
  }

  .error-dialog-item-tag {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
  }

  .tag-initiator {
    background: #fff7e6;
    color: #ff7d00;
  }

  .tag-approver {
    background: #e8f5ff;
    color: #165dff;
  }

  .tag-cc {
    background: #f0f5ff;
    color: #165dff;
  }

  .tag-condition {
    background: #fff2f0;
    color: #f53f3f;
  }

  .tag-default {
    background: #f2f3f5;
    color: #4e5969;
  }

  .error-dialog-item-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .error-dialog-item-name {
    font-weight: 500;
    color: #1d2129;
    flex-shrink: 0;
  }

  .error-dialog-item-msg {
    color: #4e5969;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
