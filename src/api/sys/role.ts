import axios from 'axios';

export const sysRoleApi = {
  // 角色分页查询
  rolePage(params: any) {
    return axios.get('/system/sys/role/page', { params });
  },
  // 获取角色列表
  getList() {
    return axios.get('/system/sys/role/list');
  },
  getById(id: string) {
    return axios.get(`/system/sys/role/${id}`);
  },
  save(data: any) {
    return axios.post('/system/sys/role/save', data);
  },
  edit(data: any) {
    return axios.put('/system/sys/role/update', data);
  },
  deleteRoleApi(id: string) {
    return axios.delete(`/system/sys/role/${id}`);
  },
  batchDel(data: any) {
    return axios.delete('/system/sys/role', {
      data,
    });
  },
  exportExcel(params: any) {
    return axios.get('/system/sys/role/export', {
      params,
      responseType: 'blob',
    });
  },
};
