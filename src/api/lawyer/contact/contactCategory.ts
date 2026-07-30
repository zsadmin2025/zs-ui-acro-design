import axios from 'axios';

export const contactCategoryApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/contact/contactCategory/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/contact/contactCategory/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/contact/contactCategory/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/contact/contactCategory/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/contact/contactCategory/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/contact/contactCategory/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/contact/contactCategory', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/contact/contactCategory/export', {
      params,
      responseType: 'blob',
    });
  },
};
