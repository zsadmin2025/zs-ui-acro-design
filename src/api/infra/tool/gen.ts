import axios from 'axios';

export const genApi = {
  // 分页查询
  page(params: any) {
    return axios.get('/tool/gen/page', { params });
  },
  // 表分页查询
  dbPage(params: any) {
    return axios.get('/tool/gen/db/page', { params });
  },
  // 获取列表
  getList() {
    return axios.get('/tool/gen/list');
  },
  getById(id: string) {
    return axios.get(`/tool/gen/info/${id}`);
  },
  // 导入表
  importTable(data: any) {
    return axios.post('/tool/gen/importTable', data);
  },
  // 预览代码
  previewCode(tableId: string) {
    return axios.get(`/tool/gen/preview/${tableId}`);
  },
  // 生成代码
  genCode(data: any) {
    return axios.post('/tool/gen/genCode', data);
  },

  // 下载代码
  downloadCode(tableId: string) {
    return axios.get(`/tool/gen/download/zip/${tableId}`, {
      responseType: 'blob',
    });
  },
  save(data: any) {
    return axios.post('/tool/gen/save', data);
  },
  edit(data: any) {
    return axios.put('/tool/gen/update', data);
  },
  del(id: string) {
    return axios.delete(`/tool/gen/${id}`);
  },
  batchDel(data: any) {
    return axios.delete('/tool/gen', {
      data,
    });
  },
};
