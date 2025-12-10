<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item">
      {{ item }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import useBreadcrumb from '@/hooks/useBreadcrumb';

  const { breadcrumbItems } = useBreadcrumb();
</script>

<style scoped lang="less">
  .container-breadcrumb {
    height: var(--breadcrumb-height);
    margin: calc(var(--base-padding) / 2) 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
