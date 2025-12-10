<template>
  <div v-if="!appStore.navbar" class="fixed-settings" @click="setVisible">
    <a-button type="primary">
      <template #icon>
        <icon-settings />
      </template>
    </a-button>
  </div>
  <a-drawer
    :width="300"
    unmount-on-close
    :visible="visible"
    :cancel-text="$t('settings.close')"
    :ok-text="$t('settings.restoreDefault')"
    @ok="resetSettings"
    @cancel="cancel"
  >
    <template #title> {{ $t('settings.title') }} </template>
    <Block :options="contentOpts" :title="$t('settings.content')" />
    <Block :options="othersOpts" :title="$t('settings.otherSettings')" />
    <!-- <a-alert>{{ $t('settings.alertContent') }}</a-alert> -->
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useAppStore } from '@/store';
  import Block from './block.vue';

  const emit = defineEmits(['cancel']);

  const appStore = useAppStore();
  const visible = computed(() => appStore.globalSettings);
  const contentOpts = computed(() => [
    {
      name: '布局',
      key: 'layout',
      defaultVal: appStore.layout,
      type: 'select',
    },
    {
      name: 'settings.themeColor',
      key: 'themeColor',
      defaultVal: appStore.themeColor,
      type: 'colorPicker',
    },
    { name: 'settings.navbar', key: 'navbar', defaultVal: appStore.navbar },
    {
      name: 'settings.menu',
      key: 'menu',
      defaultVal: appStore.menu,
    },
    { name: 'settings.footer', key: 'footer', defaultVal: appStore.footer },
    {
      name: 'settings.darkMenuMode',
      key: 'darkMenuMode',
      defaultVal: appStore.darkMenuMode,
    },
    {
      name: 'settings.darkNavbarMode',
      key: 'darkNavbarMode',
      defaultVal: appStore.darkNavbarMode,
    },
    { name: 'settings.tabBar', key: 'tabBar', defaultVal: appStore.tabBar },
    {
      name: 'settings.breadcrumb',
      key: 'breadcrumb',
      defaultVal: appStore.breadcrumb,
    },
    {
      name: 'settings.menuWidth',
      key: 'menuWidth',
      defaultVal: appStore.menuWidth,
      type: 'number',
    },
  ]);
  const othersOpts = computed(() => [
    {
      name: 'settings.colorWeak',
      key: 'colorWeak',
      defaultVal: appStore.colorWeak,
    },
  ]);

  const cancel = () => {
    appStore.updateSettings({ globalSettings: false });
    emit('cancel');
  };
  const resetSettings = () => {
    // 刷新页面
    window.location.reload();
    appStore.reloadDefaultSettings();
  };
  const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
  };

  onMounted(() => {
    appStore.initSettings();
  });
</script>

<style scoped lang="less">
  .fixed-settings {
    position: fixed;
    top: 280px;
    right: 0;
    z-index: 999;

    svg {
      font-size: 18px;
      vertical-align: -4px;
    }
  }
</style>
