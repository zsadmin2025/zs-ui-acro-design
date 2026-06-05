import axios from 'axios';

export const bpmProcessApi = {
  // 获取可发起的流程定义列表
  getDefinitions(params?: any) {
    return axios.get('/bpm/process/definitions', { params });
  },
  // 获取流程定义详情（含表单配置）
  getDefinitionByKey(key: string) {
    return axios.get(`/bpm/process/definition/${key}`);
  },
  // 发起流程
  startProcess(
    key: string,
    data: { formData: Record<string, any>; ccUserIds?: string[] },
  ) {
    return axios.post(`/bpm/process/start/${key}`, data);
  },
};
