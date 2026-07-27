<template>
  <div class="dict-container">
    <a-layout :class="{ 'mobile-layout': appStore.device === 'mobile' }">
      <a-layout-sider :width="appStore.device === 'mobile' ? undefined : 260">
        <dict-type />
      </a-layout-sider>
      <a-layout-content>
        <dict-data />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import DictType from './components/dict-type.vue';
  import DictData from './components/dict-data.vue';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .dict-container {
    height: 100%;

    .arco-layout {
      height: var(--app-main-height);
      display: flex;

      .arco-layout-sider {
        border: 1px solid var(--color-neutral-3);
        padding: var(--base-padding);
        background-color: var(--color-bg-2);
        border-radius: var(--border-radius);
        box-shadow: 0 0 12px var(--shadow-special);
      }

      .arco-layout-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: var(--base-padding);
        overflow: hidden;
      }

      &.mobile-layout {
        flex-direction: column;

        :deep(.arco-layout-sider) {
          width: 100% !important;
          flex: 0 0 300px !important;
          height: 300px !important;
          margin-bottom: 16px;
        }

        .arco-layout-content {
          margin-left: 0;
          width: 100%;
          flex: 1;
        }
      }
    }
  }
</style>
