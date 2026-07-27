import axios from 'axios';

export const bpmSettingFormApi = {
  getFormPage(params?: any) {
    return axios.get('/bpm/form/definition/page', { params });
  },
  getFormById(id: string) {
    return axios.get(`/bpm/form/definition/${id}`);
  },
  saveForm(data: any) {
    return axios.post('/bpm/form/definition/save', data);
  },
  updateForm(data: any) {
    return axios.put('/bpm/form/definition/update', data);
  },
  deleteForm(id: string) {
    return axios.delete(`/bpm/form/definition/${id}`);
  },
  publishForm(id: string) {
    return axios.post(`/bpm/form/definition/${id}/publish`);
  },
};
