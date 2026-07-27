import axios from 'axios';

export const bpmSettingInstanceApi = {
  // 获取流程实例分页列表
  getAllInstancePage(params?: any) {
    return axios.get('/bpm/setting/instance/all/page', { params });
  },
  // 分页查询运行中的实例
  getRunningInstancePage(params?: any) {
    return axios.get('/bpm/setting/instance/running/page', { params });
  },

  getInstanceById(processInstanceId: string) {
    return axios.get(`/bpm/setting/instance/${processInstanceId}`);
  },
  suspendInstance(processInstanceId: string) {
    return axios.post(`/bpm/setting/instance/suspend/${processInstanceId}`);
  },
  activateInstance(processInstanceId: string) {
    return axios.post(`/bpm/setting/instance/activate/${processInstanceId}`);
  },
  terminateInstance(processInstanceId: string) {
    return axios.delete(`/bpm/setting/terminate/${processInstanceId}`);
  },
};
