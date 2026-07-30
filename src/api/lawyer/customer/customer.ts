import axios from 'axios';

export const customerApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/customer/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/customer/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/customer/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/customer/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/customer/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/customer/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/customer', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/customer/export', {
      params,
      responseType: 'blob',
    });
  },
};
