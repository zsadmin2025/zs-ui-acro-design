import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const RESULT: AppRouteRecordRaw = {
  path: '/result',
  name: 'result',
  component: DEFAULT_LAYOUT,
  meta: {
    title: 'menu.result',
    icon: 'icon-check-circle',
    requiresAuth: true,
    order: 5,
  },
  children: [
    {
      path: 'success',
      name: 'Success',
      component: () => import('@/views/result/success/index.vue'),
      meta: {
        title: 'menu.result.success',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'error',
      name: 'Error',
      component: () => import('@/views/result/error/index.vue'),
      meta: {
        title: 'menu.result.error',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default RESULT;
