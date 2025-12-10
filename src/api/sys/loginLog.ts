import axios from 'axios';

export const sysLogLoginApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sys/log/login/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sys/log/login/list', { params });
  },

  // 获取列表
  getTodayList(params: any) {
    return axios.get('/system/sys/log/login/todayList', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sys/log/login/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sys/log/login/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sys/log/login/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sys/log/login/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/log/login', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/log/login/export', {
      params,
      responseType: 'blob',
    });
  },
};
