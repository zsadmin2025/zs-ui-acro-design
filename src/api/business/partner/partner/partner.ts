import axios from 'axios';

export const businessPartnerApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/business/partner/partner/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/business/partner/partner/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/business/partner/partner/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/business/partner/partner/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/business/partner/partner/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/business/partner/partner/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/business/partner/partner', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/business/partner/partner/export', {
      params,
      responseType: 'blob',
    });
  },
};
