import axios from 'axios';

export const bpmSettingUserGroupApi = {
  getUserGroupPage(params?: any) {
    return axios.get('/bpm/setting/user-group/page', { params });
  },
  getUserGroupById(id: string) {
    return axios.get(`/bpm/setting/user-group/${id}`);
  },
  saveUserGroup(data: any) {
    return axios.post('/bpm/setting/user-group/save', data);
  },
  updateUserGroup(data: any) {
    return axios.put('/bpm/setting/user-group/update', data);
  },
  deleteUserGroup(id: string) {
    return axios.delete(`/bpm/setting/user-group/${id}`);
  },
};
