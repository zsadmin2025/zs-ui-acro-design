import axios from 'axios';

export const caseInfoFilesApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/cases/infoFiles/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/cases/infoFiles/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/cases/infoFiles/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/cases/infoFiles/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/cases/infoFiles/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/cases/infoFiles/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/cases/infoFiles', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/cases/infoFiles/export', {
      params,
      responseType: 'blob',
    });
  },
};
