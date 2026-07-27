import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { isLogin } from '@/utils/auth';
import { useAppStore, useUserStore } from '@/store';
import { transformRoutes } from '@/router/routes/index';
import { Router, LocationQueryRaw } from 'vue-router';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from '@/router/routes/base';
import USER from '@/router/routes/modules/user';
import PROFILE from '@/router/routes/modules/profile';
import DYNAMIC_FORM from '@/router/routes/modules/dynamicForm';
import type { RouteRecordRaw } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import { waitForPreload } from '@/preload';
import { WHITE_LIST } from '../constants';

NProgress.configure({ showSpinner: false });

const addRoutesToRouter = (router: Router, routes: any[]) => {
  // 服务端菜单数据中的顶级路由已包含 Layout 组件，直接添加为顶级路由
  routes.forEach((route) => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route);
    }
  });
};

const addSpecialRoutes = (router: Router) => {
  router.addRoute(USER as RouteRecordRaw);
  router.addRoute(PROFILE as RouteRecordRaw);
  router.addRoute(DYNAMIC_FORM as RouteRecordRaw);
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
      if (!appStore.routesRegistered) {
        try {
          // 等待预加载完成（如果尚未加载菜单数据）
          if (!appStore.hasFetchedMenus) {
            await waitForPreload();

            // 检查预加载后用户是否仍然有效（token 可能已被清除）
            if (!isLogin()) {
              next({
                name: 'login',
                query: { redirect: to.path, ...to.query } as LocationQueryRaw,
              });
              NProgress.done();
              return;
            }
          }

          // 检查菜单数据是否加载成功
          if (appStore.serverMenu && appStore.serverMenu.length > 0) {
            // 预加载成功，加载动态路由
            const newRoutes = transformRoutes(appStore.serverMenu);
            addRoutesToRouter(router, newRoutes);
            addSpecialRoutes(router);
            appStore.routesRegistered = true;
            // 使用 replace: true 确保路由正确替换
            next({ ...to, replace: true });
          } else {
            // 菜单数据为空，可能是接口异常，直接放行让页面加载
            addSpecialRoutes(router);
            appStore.routesRegistered = true;
            next();
          }
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
