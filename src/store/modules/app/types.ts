import type { RouteRecordNormalized } from 'vue-router';

export interface AppState {
  theme: string;
  layout: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  darkMenuMode: boolean;
  darkNavbarMode: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  breadcrumb: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  [key: string]: unknown;
}
