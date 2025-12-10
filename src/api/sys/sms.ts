import axios from 'axios';

export const sysSmsTemplateApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sms/template/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sms/template/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sms/template/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sms/template/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sms/template/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sms/template/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sms/template', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sms/template/export', {
      params,
      responseType: 'blob',
    });
  },
  // 发送短信
  send(data: any) {
    return axios.post('/system/sms/template/send', data);
  },
};

export const sysSmsRecordApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sms/record/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sms/record/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sms/record/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sms/record/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sms/record/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sms/record/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sms/record', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sms/record/export', {
      params,
      responseType: 'blob',
    });
  },
};
