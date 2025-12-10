<template>
  <a-layout>
    <a-layout>
      <a-layout-sider
        v-show="menu"
        class="layout-sider"
        breakpoint="xl"
        :collapsed="collapsed"
        :collapsible="true"
        :width="menuWidth"
        :style="{ paddingTop: navbar ? '0px' : '' }"
        :hide-trigger="true"
        @collapse="setCollapsed"
      >
        <div
          :class="[
            collapsed ? 'logo-wrapper' : 'logo-wrapper-collapsed',
            darkMenuMode ? 'dark-navbar' : '',
          ]"
        >
          <a-space>
            <img alt="logo" src="@/assets/logo.png" class="logo" />
            <a-typography-title
              v-if="!collapsed"
              :style="{ margin: 0, fontSize: '18px' }"
              :heading="5"
            >
              {{ websiteName }}
            </a-typography-title>
          </a-space>
        </div>
        <div class="menu-wrapper">
          <Menu />
        </div>
      </a-layout-sider>
      <a-layout class="layout-content" :style="paddingStyle">
        <div v-if="navbar" class="layout-navbar">
          <NavBar />
        </div>
        <TabBar v-if="appStore.tabBar" />
        <a-layout-content
          class="main-layout"
          :class="{ 'no-breadcrumb': !appStore.breadcrumb }"
        >
          <ZsBreadcrumb v-if="appStore.breadcrumb" />
          <PageLayout />
        </a-layout-content>
        <Footer v-if="footer" />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, provide, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Footer from '@/components/footer/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';
  import PageLayout from '../page-layout.vue';

  const websiteName = computed(() => websiteStore().website?.websiteName ?? '');
  const isInit = ref(false);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const navbar = computed(() => appStore.navbar);
  const menu = computed(() => appStore.menu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const darkMenuMode = computed(() => {
    return appStore.darkMenuMode;
  });
  const paddingStyle = computed(() => {
    const paddingLeft = menu.value
      ? { paddingLeft: `${menuWidth.value}px` }
      : {};
    return { ...paddingLeft };
  });
  const setCollapsed = (val: boolean) => {
    if (!isInit.value) return; // for page initialization menu state problem
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.permissions,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    },
  );
  const drawerVisible = ref(false);

  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
  onMounted(() => {
    isInit.value = true;
  });
</script>

<style scoped lang="less">
  @layout-max-width: 1100px;

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    &::after {
      position: absolute;
      top: 0;
      right: 0px;
      display: block;
      width: 0px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }
  .logo-wrapper {
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 33px;
      height: 33px;
    }
  }
  .logo-wrapper-collapsed {
    height: var(--nav-height);
    display: flex;
    align-items: center;
    padding-left: 20px;

    .logo {
      width: 33px;
      height: 33px;
    }
  }
  .menu-wrapper {
    height: calc(100% - var(--nav-height));
    overflow: auto;
    overflow-x: hidden;
    :deep(.arco-menu) {
      ::-webkit-scrollbar {
        width: 12px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        border: 4px solid transparent;
        background-clip: padding-box;
        border-radius: 7px;
        background-color: var(--color-text-4);
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);

    .main-layout {
      padding: 0 var(--base-padding) var(--base-padding) var(--base-padding);

      &.no-breadcrumb {
        padding: var(--base-padding); // 没有 breadcrumb 时四边一样
      }
    }
  }
</style>
