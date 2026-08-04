import axios from 'axios';

export const businessWarehouseInfoApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/business/warehouse/info/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/business/warehouse/info/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/business/warehouse/info/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/business/warehouse/info/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/business/warehouse/info/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/business/warehouse/info/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/business/warehouse/info', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/business/warehouse/info/export', {
      params,
      responseType: 'blob',
    });
  },
};
