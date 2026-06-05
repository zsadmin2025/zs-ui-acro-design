import axios from 'axios';

export const bpmSettingApi = {
  // ========== 流程模型 ==========
  getModelPage(params?: any) {
    return axios.get('/bpm/setting/model/page', { params });
  },
  getModelById(id: string) {
    return axios.get(`/bpm/setting/model/${id}`);
  },
  saveModel(data: any) {
    return axios.post('/bpm/setting/model/save', data);
  },
  updateModel(data: any) {
    return axios.put('/bpm/setting/model/update', data);
  },
  deleteModel(id: string) {
    return axios.delete(`/bpm/setting/model/${id}`);
  },
  deployModel(id: string) {
    return axios.post(`/bpm/setting/model/${id}/deploy`);
  },

  // ========== 流程表单 ==========
  getFormPage(params?: any) {
    return axios.get('/bpm/form/definition/page', { params });
  },
  getFormById(id: string) {
    return axios.get(`/bpm/form/definition/${id}`);
  },
  saveForm(data: any) {
    return axios.post('/bpm/form/definition/save', data);
  },
  updateForm(data: any) {
    return axios.put('/bpm/form/definition/update', data);
  },
  deleteForm(id: string) {
    return axios.delete(`/bpm/form/definition/${id}`);
  },
  publishForm(id: string) {
    return axios.post(`/bpm/form/definition/${id}/publish`);
  },

  // ========== 流程分类 ==========
  getCategoryPage(params?: any) {
    return axios.get('/bpm/setting/category/page', { params });
  },
  getCategoryById(id: string) {
    return axios.get(`/bpm/setting/category/${id}`);
  },
  saveCategory(data: any) {
    return axios.post('/bpm/setting/category/save', data);
  },
  updateCategory(data: any) {
    return axios.put('/bpm/setting/category/update', data);
  },
  deleteCategory(id: string) {
    return axios.delete(`/bpm/setting/category/${id}`);
  },

  // ========== 用户分组 ==========
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

  // ========== 流程监听器 ==========
  getListenerPage(params?: any) {
    return axios.get('/bpm/setting/listener/page', { params });
  },
  getListenerById(id: string) {
    return axios.get(`/bpm/setting/listener/${id}`);
  },
  saveListener(data: any) {
    return axios.post('/bpm/setting/listener/save', data);
  },
  updateListener(data: any) {
    return axios.put('/bpm/setting/listener/update', data);
  },
  deleteListener(id: string) {
    return axios.delete(`/bpm/setting/listener/${id}`);
  },

  // ========== 流程表达式 ==========
  getExpressionPage(params?: any) {
    return axios.get('/bpm/setting/expression/page', { params });
  },
  getExpressionById(id: string) {
    return axios.get(`/bpm/setting/expression/${id}`);
  },
  saveExpression(data: any) {
    return axios.post('/bpm/setting/expression/save', data);
  },
  updateExpression(data: any) {
    return axios.put('/bpm/setting/expression/update', data);
  },
  deleteExpression(id: string) {
    return axios.delete(`/bpm/setting/expression/${id}`);
  },

  // ========== 流程实例 ==========
  getInstancePage(params?: any) {
    return axios.get('/bpm/setting/instance/page', { params });
  },
  getInstanceById(processInstanceId: string) {
    return axios.get(`/bpm/setting/instance/${processInstanceId}`);
  },
  suspendInstance(processInstanceId: string) {
    return axios.post(`/bpm/setting/instance/${processInstanceId}/suspend`);
  },
  activateInstance(processInstanceId: string) {
    return axios.post(`/bpm/setting/instance/${processInstanceId}/activate`);
  },
  deleteInstance(processInstanceId: string) {
    return axios.delete(`/bpm/setting/instance/${processInstanceId}`);
  },

  // ========== 流程任务管理 ==========
  getTaskAdminPage(params?: any) {
    return axios.get('/bpm/setting/task/page', { params });
  },
  getTaskAdminById(taskId: string) {
    return axios.get(`/bpm/setting/task/${taskId}`);
  },
  deleteTaskAdmin(taskId: string) {
    return axios.delete(`/bpm/setting/task/${taskId}`);
  },
};
