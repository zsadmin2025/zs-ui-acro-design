import axios from 'axios';
import type { TaskCompleteParams } from '@/types/bpm/bpmTypes';

export const bpmTaskTodoApi = {
  getTodoList(params?: any) {
    return axios.get('/bpm/task/todo', { params });
  },
  getTodoDetail(taskId: string) {
    return axios.get(`/bpm/task/todo/${taskId}`);
  },
  getTaskDetail(taskId: string, processInstanceId: string) {
    return axios.get('/bpm/task/detail', {
      params: { taskId, processInstanceId },
    });
  },
  completeTask(data: TaskCompleteParams) {
    return axios.post(`/bpm/task/complete`, data);
  },
  claimTask(taskId: string, data?: { comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/claim`, data);
  },
  unclaimTask(taskId: string, data?: { comment?: string }) {
    return axios.post(`/bpm/task/todo/${taskId}/unclaim`, data);
  },
};
