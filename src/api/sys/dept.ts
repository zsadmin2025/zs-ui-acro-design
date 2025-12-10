import axios from 'axios';

export const sysDeptApi = {
  getDeptTree(params: any) {
    return axios.get('/system/sys/dept/tree', { params });
  },
  getPage(params: any) {
    return axios.get('/system/sys/dept/page', { params });
  },
  getById(id: string) {
    return axios.get(`/system/sys/dept/${id}`);
  },
  save(data: any) {
    return axios.post('/system/sys/dept/save', data);
  },
  edit(data: any) {
    return axios.put('/system/sys/dept/update', data);
  },
  deletePostApi(id: string) {
    return axios.delete(`/system/sys/dept/${id}`);
  },
  getDeptPostTree() {
    return axios.get('/system/sys/dept/getDeptPostTree');
  },
};
