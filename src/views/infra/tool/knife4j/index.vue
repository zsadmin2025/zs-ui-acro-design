<template>
  <div class="knife4j-container">
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
  const url = `${import.meta.env.VITE_API_BASE_URL}/doc.html`;
</script>

<style lang="less" scoped>
  .knife4j-container {
    height: 100vh;

    .iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
