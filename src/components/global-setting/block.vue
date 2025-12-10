<template>
  <div class="block">
    <h5 class="title">{{ title }}</h5>
    <div v-for="option in options" :key="option.name">
      <div v-if="option.type === 'colorPicker'" class="colorPicker-wrapper">
        <span>{{ $t(option.name) }}</span>
        <form-wrapper
          :type="'colorPicker'"
          :name="option.key"
          :default-value="option.defaultVal"
          @input-change="handleChange"
        />
      </div>
      <div v-else class="switch-wrapper">
        <span>{{ $t(option.name) }}</span>
        <form-wrapper
          :type="option.type || 'switch'"
          :name="option.key"
          :default-value="option.defaultVal"
          @input-change="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { variables } from '@/config/css-variables';
  import { useAppStore } from '@/store';
  import FormWrapper from './form-wrapper.vue';

  interface OptionsProps {
    name: string;
    key: string;
    type?: string;
    defaultVal?: boolean | string | number;
  }
  defineProps({
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<OptionsProps[]>,
      default() {
        return [];
      },
    },
  });
  const appStore = useAppStore();

  // 缓存原始高度
  const cssVariables = {
    nav: variables.navHeight,
    tabs: variables.tabsHeight,
    breadcrumb: variables.breadcrumbHeight,
    footer: variables.footerHeight,
  };

  // 统一设置 CSS 变量
  function updateCssVariable(
    varKey: keyof typeof cssVariables,
    value: any,
  ): void {
    const root = document.documentElement;
    const prop = `--${varKey === 'tabs' ? 'tabs' : varKey}-height`;
    const height = value ? cssVariables[varKey] : '0px';
    root.style.setProperty(prop, height);
  }

  // 更新主题色
  function updateThemeColor(value: string): void {
    appStore.updateTheme(value);
  }

  function handleChange({ key, value }: { key: string; value: unknown }): void {
    switch (key) {
      case 'colorWeak':
        document.body.style.filter = value ? 'invert(80%)' : 'none';
        break;
      case 'menuFromServer':
        if (value) appStore.fetchServerMenuConfig();
        break;
      case 'topMenu':
        appStore.updateSettings({ menuCollapse: false });
        break;
      case 'themeColor':
        updateThemeColor(value as string);
        appStore.updateSettings({ themeColor: value as string });
        break;
      case 'navbar':
        updateCssVariable('nav', value);
        break;
      case 'tabBar':
        updateCssVariable('tabs', value);
        break;
      case 'breadcrumb':
        updateCssVariable('breadcrumb', value);
        break;
      case 'footer':
        updateCssVariable('footer', value);
        break;
      default:
        break;
    }
    // 更新 store 中配置
    appStore.updateSettings({ [key]: value });
  }
</script>

<style scoped lang="less">
  .block {
    margin-bottom: 24px;
  }

  .title {
    margin: 10px 0;
    padding: 0;
    font-size: 14px;
  }

  .colorPicker-wrapper {
    line-height: 32px;
  }
  .switch-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 32px;
  }
</style>
