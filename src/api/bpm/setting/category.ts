import axios from 'axios';

export const bpmSettingCategoryApi = {
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
};
