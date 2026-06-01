<template>
  <div class="page-layout-wrapper">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in" appear>
        <component
          :is="Component"
          v-if="route.meta.ignoreCache"
          :key="route.fullPath"
        />
        <keep-alive v-else :include="cacheList">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>

    <div v-if="pageLoading" class="page-loading-mask">
      <a-spin :loading="true" tip="页面加载中..." />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';
  import usePageLoading from '@/hooks/pageLoading';

  const tabBarStore = useTabBarStore();
  const { pageLoading } = usePageLoading();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
  .page-layout-wrapper {
    position: relative;
    min-height: 100%;
  }

  .page-loading-mask {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
  }
</style>
