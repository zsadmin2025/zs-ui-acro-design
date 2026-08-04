import axios from 'axios';

export const businessDrugGoodsCategoryApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/business/goods/category/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/business/goods/category/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/business/goods/category/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/business/goods/category/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/business/goods/category/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/business/goods/category/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/business/goods/category', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/business/goods/category/export', {
      params,
      responseType: 'blob',
    });
  },
};
