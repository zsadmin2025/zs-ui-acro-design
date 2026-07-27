<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const fullPath = route.params.path as string;
  const [path, queryStr] = fullPath.split('?');
  const query: Record<string, string> = {};

  if (queryStr) {
    queryStr.split('&').forEach((item) => {
      const [key, value] = item.split('=');
      if (key) {
        query[key] = value || '';
      }
    });
  }

  router.replace({ path, query });
</script>

<style scoped lang="less"></style>
