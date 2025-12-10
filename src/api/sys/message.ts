import axios from 'axios';

export const sysMessagesApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/system/sys/messages/page', { params });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/system/sys/messages/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/system/sys/messages/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/system/sys/messages/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/system/sys/messages/update', data);
  },

  // 批量更新已读状态
  batchUpdateRead(ids: string[]) {
    return axios.put('/system/sys/messages/update/read', ids);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/system/sys/messages/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/messages', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/messages/export', {
      params,
      responseType: 'blob',
    });
  },
};
