import axios from 'axios';

export const basicApprovalConfigurationApi = {
  // 获取
  getInfo() {
    return axios.get('/lawyer/basic/approval/info');
  },

  // 保存
  save(data: any) {
    return axios.post('/lawyer/basic/approval/save', data);
  },
  // 获取审批角色用户列表
  getApprovalRoleUserList() {
    return axios.get('/lawyer/basic/approval/registration');
  },
  // 获取结案角色用户
  getCloseRoleUserList() {
    return axios.get('/lawyer/basic/approval/closing');
  },
  // 获取用章角色用户
  getUseRoleUserList() {
    return axios.get('/lawyer/basic/approval/usingChapter');
  },
};
