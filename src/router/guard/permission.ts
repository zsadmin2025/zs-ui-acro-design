import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { isLogin } from '@/utils/auth';
import { useAppStore, useUserStore } from '@/store';
import { transformRoutes } from '@/router/routes/index';
import { Router, LocationQueryRaw } from 'vue-router';
import {
  REDIRECT_MAIN,
  NOT_FOUND_ROUTE,
  DEFAULT_LAYOUT,
} from '@/router/routes/base';
import USER from '@/router/routes/modules/user';
import PROFILE from '@/router/routes/modules/profile';
import type { RouteRecordRaw } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import { WHITE_LIST } from '../constants';

NProgress.configure({ showSpinner: false });

const addRoutesToRouter = (router: Router, routes: any[]) => {
  // routes.forEach((route) => {
  //   if (!router.hasRoute(route.name)) {
  //     router.addRoute(route);
  //   }
  // });

  router.addRoute({
    path: '/',
    component: DEFAULT_LAYOUT,
    children: routes,
  });
};

const addSpecialRoutes = (router: Router) => {
  router.addRoute(USER as RouteRecordRaw);
  router.addRoute(PROFILE as RouteRecordRaw);
  // 添加重定向和404路由
  router.addRoute(REDIRECT_MAIN);
  router.addRoute(NOT_FOUND_ROUTE);
};

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const isLoginPage = to.path === '/login';
    // 已登录的情况
    if (isLogin()) {
      if (isLoginPage) {
        next();
        NProgress.done();
        return;
      }
      const userStore = useUserStore();
      const appStore = useAppStore();
      if (!appStore.hasFetchedMenus) {
        try {
          // await userStore.info();
          // await appStore.fetchServerMenuConfig();
          // const newRoutes = transformRoutes(appStore.serverMenu);
          // 并行执行异步操作
          await Promise.all([
            userStore.info(),
            appStore.fetchServerMenuConfig(),
          ]);
          const newRoutes = transformRoutes(appStore.serverMenu);
          addRoutesToRouter(router, newRoutes);
          addSpecialRoutes(router); // 加载完动态路由后添加特殊路由

          next({ ...to, replace: true });
          NProgress.done();
        } catch (error) {
          /* eslint-disable no-console */
          console.error('路由守卫加载菜单失败:', error); // 使用 error
          await userStore.logout();
          next('/login'); // 跳转到登录页
          NProgress.done();
        }
      } else {
        // 如果已经加载过动态路由，则直接放行
        next();
        NProgress.done();
      }
    } else {
      if (WHITE_LIST.find((el) => el.name === to.name)) {
        next();
      } else {
        next({
          name: 'login',
          query: { redirect: to.path, ...to.query } as LocationQueryRaw,
        });
      }
      NProgress.done();
    }
  });

  router.afterEach((to) => {
    setRouteEmitter(to); // 必须有！
  });
}
