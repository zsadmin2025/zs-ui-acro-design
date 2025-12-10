<template>
  <div class="jmreport-container">
    <iframe
      :src="url"
      frameborder="0"
      width="100%"
      height="100%"
      class="iframe"
    />
  </div>
</template>

<script lang="ts" setup>
  import { getToken, getTenantId } from '@/utils/auth';

  const token = getToken() || '';
  const tenantId = getTenantId() || '';
  const url = `${
    import.meta.env.VITE_API_BASE_URL
  }/jmreport/list?token=Bearer ${encodeURIComponent(
    token,
  )}&X-Tenant-Id=${tenantId}`;
</script>

<style lang="less" scoped>
  .jmreport-container {
    height: 100vh;

    .iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
