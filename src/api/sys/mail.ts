import axios from 'axios';

export const sysMailTasksApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sys/tasks/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sys/tasks/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sys/tasks/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sys/tasks/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sys/tasks/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sys/tasks/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/tasks', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/tasks/export', {
      params,
      responseType: 'blob',
    });
  },

  // 发送邮件任务
  sendMailTask(data: any) {
    return axios.post('/system/sys/tasks/send', data);
  },

  // 立即发送
  sendNow(data: any) {
    return axios.post('/system/sys/tasks/sendNow', data);
  },
};
