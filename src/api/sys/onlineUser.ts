import axios from 'axios';

export const sysOnlineUserApi = {
  getOnlineUserPage(params: any) {
    return axios.get('/system/sys/onlineUser/getOnlineUsersPage', {
      params,
    });
  },
};
