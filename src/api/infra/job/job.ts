import axios from 'axios';

export const sysJobApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/infra/job/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/infra/job/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/infra/job/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/infra/job/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/infra/job/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/infra/job/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/infra/job', { data });
  },
  // 暂停
  pause(data: any) {
    return axios.post('/infra/job/pause', data);
  },
  // 恢复
  resume(data: any) {
    return axios.post('/infra/job/resume', data);
  },
  // 立即执行
  run(data: any) {
    return axios.post('/infra/job/run', data);
  },
  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/infra/job/export', {
      params,
      responseType: 'blob',
    });
  },

  jobLogPage(params: any) {
    return axios.get('/infra/job/log/page', { params });
  },

  // 导出执行日志数据为Excel
  exportJobLogExcel(params: any) {
    return axios.get('/infra/job/log/export', {
      params,
      responseType: 'blob',
    });
  },
};
