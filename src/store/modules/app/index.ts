import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import { variables } from '@/config/css-variables';
import { sysMenuApi } from '@/api/sys/menu';
import defaultSettings from '@/config/settings';
import { generate, getRgbStr } from '@arco-design/color';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ...defaultSettings,
    serverMenu: [],
    hasFetchedMenus: false,
  }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },
  persist: {
    key: 'defaultSettings',
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    omit: ['serverMenu', 'hasFetchedMenus'],
  },
  actions: {
    getCssVariable(name: string) {
      // 获取 document root 上的计算样式
      const rootStyle = getComputedStyle(document.documentElement);
      return rootStyle.getPropertyValue(name).trim();
    }, // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },
    initTheme() {
      const list = generate(this.themeColor, {
        list: true,
        dark: false,
      }).map((x) => getRgbStr(x));
      list.forEach((x, i) => {
        document.body.style.setProperty(`--primary-${i + 1}`, x);
        document.body.style.setProperty(`--arcoblue-${i + 1}`, x);
      });
    },
    updateTheme(value: string) {
      const list = generate(value, {
        list: true,
        dark: false,
      }).map((x) => getRgbStr(x));
      list.forEach((x, i) => {
        document.body.style.setProperty(`--primary-${i + 1}`, x);
        document.body.style.setProperty(`--arcoblue-${i + 1}`, x);
      });
    },
    // 初始化settings
    async initSettings() {
      const root = document.documentElement;

      // 根据当前状态设置 CSS 变量
      if (!this.navbar) {
        root.style.setProperty('--nav-height', '0px');
      } else {
        root.style.setProperty('--nav-height', variables.navHeight);
      }

      if (!this.tabBar) {
        root.style.setProperty('--tabs-height', '0px');
      } else {
        root.style.setProperty('--tabs-height', variables.tabsHeight);
      }

      if (!this.breadcrumb) {
        root.style.setProperty('--breadcrumb-height', '0px');
      } else {
        root.style.setProperty(
          '--breadcrumb-height',
          variables.breadcrumbHeight,
        );
      }

      if (!this.footer) {
        root.style.setProperty('--footer-height', '0px');
      } else {
        root.style.setProperty('--footer-height', variables.footerHeight);
      }
    },
    // 重置
    reloadDefaultSettings() {
      this.$patch({ ...defaultSettings });
      // 重新初始化设置
      this.initSettings();
      // 重新获取菜单数据
      this.fetchServerMenuConfig();
    },
    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        // notifyInstance = Notification.info({
        //   id: 'menuNotice', // Keep the instance id the same
        //   content: 'loading',
        //   closable: true,
        // });
        const { data } = await sysMenuApi.getNav();
        this.serverMenu = data;
        this.hasFetchedMenus = true; // 👈 成功后标记
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: errorMessage,
          closable: true,
        });
        this.hasFetchedMenus = true; // 👈 即使失败也标记为“已尝试”，避免无限重试
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
