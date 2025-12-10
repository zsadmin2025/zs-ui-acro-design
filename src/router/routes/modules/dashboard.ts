import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '首页',
    requiresAuth: true,
    icon: 'icon-filled-home',
    order: 0,
  },
  children: [
    {
      path: 'workplace',
      name: 'workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        title: '工作台',
        icon: 'icon-outlined-desktop',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // {
    //   path: 'monitor',
    //   name: 'Monitor',
    //   component: () => import('@/views/dashboard/monitor/index.vue'),
    //   meta: {
    //     title: 'menu.dashboard.monitor',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default DASHBOARD;
