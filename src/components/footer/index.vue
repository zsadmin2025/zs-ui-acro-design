<template>
  <a-layout-footer class="footer">{{ copyright }}</a-layout-footer>
</template>

<script lang="ts" setup>
  import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';

  const copyright = computed(() => websiteStore().website?.copyright ?? '');
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--footer-height);
    color: var(--color-text-2);
    background-color: var(--color-bg-1);
    text-align: center;
  }
</style>
