import axios from 'axios';

export const sysNoticeApi = {
  page(params: any) {
    return axios.get('/system/sys/notice/page', {
      params,
    });
  },
  // 保存草稿
  save(data: any) {
    return axios.post('/system/sys/notice/save', data);
  },

  edit(data: any) {
    return axios.put('/system/sys/notice/update', data);
  },

  del(id: string) {
    return axios.delete(`/system/sys/notice/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/system/sys/notice', { data });
  },

  getById(id: string) {
    return axios.get(`/system/sys/notice/${id}`);
  },
  /**  获取最新通知 */
  getLimit(num: number) {
    return axios.get(`/system/sys/notice/limit/${num}`);
  },
  // 立即发布
  releaseImmediately(data: any) {
    return axios.post('/system/sys/notice/releaseImmediately', data);
  },
  // 发布
  release(data: any) {
    return axios.post('/system/sys/notice/release', data);
  },
  // 撤销
  revoke(data: any) {
    return axios.post('/system/sys/notice/revoke', data);
  },
};
