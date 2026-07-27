import axios from 'axios';

export const bpmSettingExpressionApi = {
  getExpressionPage(params?: any) {
    return axios.get('/bpm/setting/expression/page', { params });
  },
  getExpressionById(id: string) {
    return axios.get(`/bpm/setting/expression/${id}`);
  },
  saveExpression(data: any) {
    return axios.post('/bpm/setting/expression/save', data);
  },
  updateExpression(data: any) {
    return axios.put('/bpm/setting/expression/update', data);
  },
  deleteExpression(id: string) {
    return axios.delete(`/bpm/setting/expression/${id}`);
  },
};
