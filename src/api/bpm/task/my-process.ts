import axios from 'axios';

export const bpmTaskMyProcessApi = {
  // 启动流程
  startProcess(data?: any) {
    return axios.post(`/bpm/task/start`, data);
  },
  // 获取我的流程
  getMyProcesses(params?: any) {
    return axios.get('/bpm/setting/instance/my/processes', { params });
  },
  // 取消流程
  cancelProcess(processInstanceId: string, data?: any) {
    return axios.post(
      `/bpm/setting/instance/my/processes/${processInstanceId}/cancel`,
      data,
    );
  },
  // 催办
  urgeProcess(processInstanceId: string) {
    return axios.post(
      `/bpm/setting/instance/my/processes/${processInstanceId}/urge`,
    );
  },
  // 获取我的流程详情（审批记录、流程图等）
  getMyProcessDetail(processInstanceId: string) {
    return axios.get(`/bpm/setting/instance/my/processes/${processInstanceId}`);
  },
};
