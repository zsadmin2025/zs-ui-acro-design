import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DYNAMIC_FORM: AppRouteRecordRaw = {
  path: '/bpm/process/dynamic-form',
  name: 'dynamicForm',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '动态表单',
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'dynamicFormChild',
      component: () => import('@/views/bpm/process/DynamicFormPage.vue'),
      meta: {
        title: '动态表单',
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default DYNAMIC_FORM;
