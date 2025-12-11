<template>
  <LayoutVertical v-if="appStore.layout === 'vertical'" />
  <LayoutHorizontal v-else-if="appStore.layout === 'horizontal'" />
  <LayoutFloat v-else-if="appStore.layout === 'float'" />
  <LayoutCommon v-else-if="appStore.layout === 'common'" />
</template>

<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue';
  import { useAppStore } from '@/store';

  const appStore = useAppStore();

  const LayoutCommon = defineAsyncComponent(
    () => import('./layoutCommon/index.vue'),
  );
  const LayoutHorizontal = defineAsyncComponent(
    () => import('./layoutHorizontal/index.vue'),
  );
  const LayoutVertical = defineAsyncComponent(
    () => import('./layoutVertical/index.vue'),
  );
  const LayoutFloat = defineAsyncComponent(
    () => import('./layoutFloat/index.vue'),
  );
</script>
