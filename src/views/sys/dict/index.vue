<template>
  <div class="dict-container">
    <a-layout>
      <a-layout-sider :width="260">
        <dict-type />
      </a-layout-sider>
      <a-layout-content>
        <dict-data />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
  import DictType from './components/dict-type.vue';
  import DictData from './components/dict-data.vue';
</script>

<style lang="less" scoped>
  .dict-container {
    height: 100%;

    .arco-layout {
      height: var(--app-main-height);
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
        width: calc(100% - 260px);
      }
    }
  }
</style>
