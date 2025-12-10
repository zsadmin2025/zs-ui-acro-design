import type { RouteRecordNormalized } from 'vue-router';
import { AppRouteRecordRaw } from './types';

// const modules = import.meta.glob('./modules/*.ts', { eager: true });
// 上诉注释是加载modules文件夹下的所有路由，现在改为只加载如下路由，后续可以根据需要修改此处
const modules = import.meta.glob('./modules/dashboard.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true,
});

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  [],
);

const modules1 = import.meta.glob('@/views/**/*.vue');
const loadView = (view: any) => {
  return modules1[`/src/views${view}.vue`];
};
export const transformRoutes = (data: any[]): AppRouteRecordRaw[] => {
  return data.map((item: any) => {
    const route: AppRouteRecordRaw = {
      path: item.path,
      name: item.name,
      component: loadView(item.component),
      meta: {
        roles: ['*'],
        title: item.meta.title,
        requiresAuth: item.meta.requiresAuth,
        icon: item.meta.icon,
        order: item.meta.sort,
        hideInMenu: item.meta.hideInMenu,
        hideChildrenInMenu: item.meta.hideChildrenInMenu,
        noAffix: item.meta.noAffix,
        ignoreCache: item.meta.ignoreCache,
      },
      children: item.children ? transformRoutes(item.children) : [],
    };

    return route;
  });
};
