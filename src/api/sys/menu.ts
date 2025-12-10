import axios from 'axios';
import type { Menu } from '@/types/sys/menu/menuTypes';

export const sysMenuApi = {
  getNav() {
    return axios.get('/system/sys/menu/nav');
  },
  getMenuList(params: any) {
    return axios.get<Menu[]>('/system/sys/menu/list', {
      params,
    });
  },
  listPermission() {
    return axios.get<Menu[]>('/system/sys/menu/listPermission');
  },
  getById(id: string) {
    return axios.get(`/system/sys/menu/${id}`);
  },
  save(data: any) {
    return axios.post('/system/sys/menu/save', data);
  },
  edit(data: any) {
    return axios.put('/system/sys/menu/update', data);
  },
  del(id: string) {
    return axios.delete(`/system/sys/menu/${id}`);
  },
  // 根据菜单id获取按钮权限列表
  getBtnPermissions(id: string) {
    return axios.get(`/system/sys/menu/${id}/permissions/list`);
  },
  // 保存按钮权限
  saveBtnPermissions(data: any) {
    return axios.post('/system/sys/menu/permissions/save', data);
  },
  // 编辑按钮权限
  editBtnPermissions(data: any) {
    return axios.put('/system/sys/menu/permissions/update', data);
  },
  // 获取按钮权限信息
  getBtnPermissionsById(id: string) {
    return axios.get(`/system/sys/menu/permissions/info/${id}`);
  },
  // 删除按钮权限
  delBtnPermissions(id: string) {
    return axios.delete(`/system/sys/menu/permissions/${id}`);
  },
};
