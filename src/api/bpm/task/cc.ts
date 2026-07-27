import axios from 'axios';

export const bpmTaskCcApi = {
  getCcPage(params?: any) {
    return axios.get('/bpm/cc/page', { params });
  },
  markCcRead(id: string) {
    return axios.put(`/bpm/cc/read/${id}`);
  },
};
