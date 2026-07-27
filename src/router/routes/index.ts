import { h, defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import type { RouteRecordNormalized } from 'vue-router';
import { AppRouteRecordRaw } from './types';

// const modules = import.meta.glob('./modules/*.ts', { eager: true });
// 上诉注释是加载modules文件夹下的所有路由，现在改为只加载如下路由，后续可以根据需要修改此处
const modules = import.meta.glob('./modules/{dashboard,bpm}.ts', {
  eager: true,
});
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
  if (!view) return undefined;

  // 处理布局组件：服务端返回 "Layout" 或 "DEFAULT_LAYOUT" 都映射到默认布局
  if (view === 'Layout' || view === 'DEFAULT_LAYOUT') {
    return () => import('@/layout/default-layout.vue');
  }

  // 兼容多种格式:
  //  "@/views/xxx.vue" → normalized为"views/xxx" → 需要去掉views/前缀
  //  "/xxx/index"       → normalized为"xxx/index" (去掉开头的/)
  //  "xxx"              → normalized为"xxx"
  let normalized = view.replace(/^@\//, '').replace(/\.vue$/, '');
  // 去掉开头的/，避免拼接后出现双斜杠
  if (normalized.startsWith('/')) {
    normalized = normalized.slice(1);
  }
  // 如果 normalized 已包含 views/ 前缀，去掉它，因为 possibleKeys 会自动拼接 /src/views
  if (normalized.startsWith('views/')) {
    normalized = normalized.slice(6); // 去掉 'views/' (6个字符)
  }

  // 尝试多种可能的路径格式
  const possibleKeys = [
    `/src/views/${normalized}.vue`,
    `/src/views/${normalized}/index.vue`,
    `/src/views/${normalized}/MyProcess.vue`, // 特殊处理 bpm/task/my-process 等
    `./src/views/${normalized}.vue`,
    `./src/views/${normalized}/index.vue`,
    `./src/views/${normalized}/MyProcess.vue`,
  ];

  const foundKey = possibleKeys.find((key) => modules1[key]);
  return foundKey ? modules1[foundKey] : undefined;
};
export const transformRoutes = (
  data: any[],
  level = 0,
): AppRouteRecordRaw[] => {
  return data.map((item: any) => {
    // 调试：打印路由层级信息
    if (item.component === 'Layout' || item.component === 'DEFAULT_LAYOUT') {
      console.debug(
        `[transformRoutes] Layout组件: path=${
          item.path
        }, level=${level}, hasChildren=${item.children?.length > 0}, isKept=${
          level === 0
        }`,
      );
    }

    let component = loadView(item.component);

    // 调试：如果组件加载失败，打印警告
    if (!component && item.component) {
      console.warn(
        `[transformRoutes] 组件加载失败: ${item.component} (路由名称: ${item.name})`,
      );
    }

    // 修复：非顶级路由（level > 0）如果 component 是 Layout，
    // 将其替换为简单的 router-view 包装器，避免多层 Layout 渲染重复的 TabBar
    const isLayoutComponent =
      item.component === 'Layout' || item.component === 'DEFAULT_LAYOUT';
    if (level > 0 && isLayoutComponent) {
      // 使用 RouterView 组件（从 vue-router 导入），确保正确渲染嵌套路由
      component = defineComponent({
        name: 'RouteViewHolder',
        setup() {
          return () => h(RouterView);
        },
      }) as any;
    }

    const route: AppRouteRecordRaw = {
      path: item.path,
      name: item.name,
      component,
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
      children: item.children ? transformRoutes(item.children, level + 1) : [],
    };

    return route;
  });
};
