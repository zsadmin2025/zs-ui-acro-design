import axios from 'axios';

export const contactPeopleApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/contact/contactPeople/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/contact/contactPeople/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/contact/contactPeople/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/contact/contactPeople/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/contact/contactPeople/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/contact/contactPeople/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/contact/contactPeople', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/contact/contactPeople/export', {
      params,
      responseType: 'blob',
    });
  },
};
