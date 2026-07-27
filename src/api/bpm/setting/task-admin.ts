import axios from 'axios';

export const bpmSettingTaskAdminApi = {
  getTaskAdminPage(params?: any) {
    return axios.get('/bpm/task/allPage', { params });
  },
  getTaskAdminById(taskId: string) {
    return axios.get(`/bpm/task/${taskId}`);
  },
  deleteTaskAdmin(taskId: string) {
    return axios.delete(`/bpm/task/${taskId}`);
  },
};
