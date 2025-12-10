import axios from 'axios';

export const sysTenantPackageApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sys/tenantPackage/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sys/tenantPackage/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sys/tenantPackage/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sys/tenantPackage/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sys/tenantPackage/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sys/tenantPackage/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/tenantPackage', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/tenantPackage/export', {
      params,
      responseType: 'blob',
    });
  },
};
