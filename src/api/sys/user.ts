import axios from 'axios';

// 获取当前用户信息
export function getUserInfo() {
  return axios.get('/system/sys/user/getUserInfo');
}

// 分页查询用户
export function userPage(params: any) {
  return axios.get('/system/sys/user/page', { params });
}

// 查询用户列表（无分页）
export function getUserList(params: any) {
  return axios.get('/system/sys/user/list', { params });
}

// 批量通过ID获取用户列表
export function getUserListByIds(data: any) {
  return axios.post('/system/sys/user/getUserListByIds', data);
}

// 根据ID查询用户
export function getById(id: string) {
  return axios.get(`/system/sys/user/${id}`);
}

// 保存用户
export function save(data: any) {
  return axios.post('/system/sys/user/save', data);
}

// 修改用户
export function edit(data: any) {
  return axios.put(`/system/sys/user/update`, data);
}

// 重置密码
export function resetPassword(data: any) {
  return axios.put('/system/sys/user/resetPassword', data);
}

// 删除用户
export function deleteUserApi(id: string) {
  return axios.delete(`/system/sys/user/${id}`);
}

// 批量删除用户
export function batchDel(data: any) {
  return axios.delete('/system/sys/user', { data });
}

// 导出用户Excel
export function exportExcel(params: any) {
  return axios.get('/system/sys/user/export', {
    params,
    responseType: 'blob',
  });
}

export const sysUserApi = {
  getUserInfo,
  userPage,
  getUserList,
  getUserListByIds,
  getById,
  save,
  edit,
  resetPassword,
  deleteUserApi,
  batchDel,
  exportExcel,
};
