<template>
  <LayoutCommon v-if="appStore.layout === 'common'" />
  <LayoutHorizontal v-else-if="appStore.layout === 'horizontal'" />
  <LayoutVertical v-else-if="appStore.layout === 'vertical'" />
  <LayoutFloat v-else-if="appStore.layout === 'float'" />
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import LayoutCommon from './layoutCommon/index.vue';
  import LayoutHorizontal from './layoutHorizontal/index.vue';
  import LayoutVertical from './layoutVertical/index.vue';
  import LayoutFloat from './layoutFloat/index.vue';

  const appStore = useAppStore();
</script>
