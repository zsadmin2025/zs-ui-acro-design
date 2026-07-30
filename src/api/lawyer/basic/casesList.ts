import axios from 'axios';

export const caseListApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/basic/cases/list/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/basic/cases/list/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/basic/cases/list/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/basic/cases/list/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/basic/cases/list/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/basic/cases/list/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/basic/cases/list', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/basic/cases/list/export', {
      params,
      responseType: 'blob',
    });
  },
};
