import axios from 'axios';

export const bpmSettingListenerApi = {
  getListenerPage(params?: any) {
    return axios.get('/bpm/setting/listener/page', { params });
  },
  getListenerById(id: string) {
    return axios.get(`/bpm/setting/listener/${id}`);
  },
  saveListener(data: any) {
    return axios.post('/bpm/setting/listener/save', data);
  },
  updateListener(data: any) {
    return axios.put('/bpm/setting/listener/update', data);
  },
  deleteListener(id: string) {
    return axios.delete(`/bpm/setting/listener/${id}`);
  },
};
