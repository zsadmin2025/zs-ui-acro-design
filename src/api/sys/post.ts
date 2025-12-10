import axios from 'axios';

export const sysPostApi = {
  // 获取岗位分页数据
  postPage(params: any) {
    return axios.get('/system/sys/post/page', { params });
  },

  // 获取岗位列表
  getList(params: any) {
    return axios.get('/system/sys/post/list', { params });
  },

  // 根据ID获取岗位信息
  getById(id: string) {
    return axios.get(`/system/sys/post/${id}`);
  },

  // 新增岗位
  save(data: any) {
    return axios.post('/system/sys/post/save', data);
  },

  // 编辑岗位
  edit(data: any) {
    return axios.put('/system/sys/post/update', data);
  },

  // 删除单个岗位
  deletePostApi(id: string) {
    return axios.delete(`/system/sys/post/${id}`);
  },

  // 批量删除岗位
  batchDel(data: any) {
    return axios.delete('/system/sys/post', { data });
  },

  // 导出岗位数据为Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/post/export', {
      params,
      responseType: 'blob',
    });
  },
};
