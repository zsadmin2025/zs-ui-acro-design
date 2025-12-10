import axios from 'axios';

export const sysJobApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sys/job/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sys/job/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sys/job/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sys/job/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sys/job/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sys/job/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/job', { data });
  },
  // 暂停
  pause(data: any) {
    return axios.post('/system/sys/job/pause', data);
  },
  // 恢复
  resume(data: any) {
    return axios.post('/system/sys/job/resume', data);
  },
  // 立即执行
  run(data: any) {
    return axios.post('/system/sys/job/run', data);
  },
  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/job/export', {
      params,
      responseType: 'blob',
    });
  },

  jobLogPage(params: any) {
    return axios.get('/system/sys/job/log/page', { params });
  },

  // 导出执行日志数据为Excel
  exportJobLogExcel(params: any) {
    return axios.get('/system/sys/job/log/export', {
      params,
      responseType: 'blob',
    });
  },
};
