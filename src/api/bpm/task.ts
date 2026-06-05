import axios from 'axios';

export const bpmTaskApi = {
  // ========== 我的流程 ==========
  getMyProcesses(params?: any) {
    return axios.get('/bpm/task/my/processes', { params });
  },
  // 撤销流程
  cancelProcess(processInstanceId: string, data?: any) {
    return axios.post(
      `/bpm/task/my/processes/${processInstanceId}/cancel`,
      data,
    );
  },

  // ========== 待办任务 ==========
  getTodoList(params?: any) {
    return axios.get('/bpm/task/todo', { params });
  },
  getTodoDetail(taskId: string) {
    return axios.get(`/bpm/task/todo/${taskId}`);
  },
  // 完成任务（通过/驳回）
  completeTask(taskId: string, data: any) {
    return axios.post(`/bpm/task/todo/${taskId}/complete`, data);
  },
  // 转办
  transferTask(taskId: string, data: { assignee: string; comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/transfer`, data);
  },
  // 委派
  delegateTask(taskId: string, data: { assignee: string; comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/delegate`, data);
  },
  // 加签
  addSignTask(taskId: string, data: { assignee: string; comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/add-sign`, data);
  },
  // 减签
  reduceSignTask(taskId: string, data: { assignee: string; comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/reduce-sign`, data);
  },
  // 抄送
  ccTask(taskId: string, data: { ccUserIds: string[]; comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/cc`, data);
  },

  // ========== 已办任务 ==========
  getDoneList(params?: any) {
    return axios.get('/bpm/task/done', { params });
  },

  // ========== 抄送我的 ==========
  getCcList(params?: any) {
    return axios.get('/bpm/task/cc', { params });
  },
  // 标记已读
  markCcRead(id: string) {
    return axios.put(`/bpm/task/cc/${id}/read`);
  },
};
