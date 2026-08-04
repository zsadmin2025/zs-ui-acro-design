import axios from 'axios';

export const businessDrugGoodsApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/business/goods/goods/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/business/goods/goods/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/business/goods/goods/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/business/goods/goods/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/business/goods/goods/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/business/goods/goods/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/business/goods/goods', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/business/goods/goods/export', {
      params,
      responseType: 'blob',
    });
  },
};
