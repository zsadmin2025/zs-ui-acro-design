import axios from 'axios';

export const bpmSettingModelApi = {
  // 获取流程模型分页列表
  getModelPage(params?: any) {
    return axios.get('/bpm/model/page', { params });
  },
  // 获取流程模型详情
  getModelById(id: string) {
    return axios.get(`/bpm/model/${id}`);
  },

  // 新增流程模型
  createModel(data: any) {
    return axios.post('/bpm/model/create', data);
  },
  saveModel(data: any) {
    return axios.post('/bpm/model/save', data);
  },
  updateModel(data: any) {
    return axios.put('/bpm/model/update', data);
  },
  deleteModel(id: string) {
    return axios.delete(`/bpm/model/${id}`);
  },
  deployModel(id: string) {
    return axios.post(`/bpm/model/deploy/${id}`);
  },
  // 获取可发起流程的流程列表
  getCanStartProcessList(params?: any) {
    return axios.get('/bpm/model/canStartList', { params });
  },
};
