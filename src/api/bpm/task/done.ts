import axios from 'axios';

export const bpmTaskDoneApi = {
  getDoneList(params?: any) {
    return axios.get('/bpm/task/done', { params });
  },
};
