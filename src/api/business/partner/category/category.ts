import axios from 'axios';

export const businessPartnerCategoryApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/business/partner/category/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/business/partner/category/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/business/partner/category/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/business/partner/category/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/business/partner/category/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/business/partner/category/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/business/partner/category', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/business/partner/category/export', {
      params,
      responseType: 'blob',
    });
  },
};
