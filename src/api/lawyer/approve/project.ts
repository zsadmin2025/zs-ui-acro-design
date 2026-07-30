import axios from 'axios';

export const projectApi = {
  // 获取立项审批分页数据
  page(params: any) {
    return axios.get('/lawyer/cases/info/approve/page', { params });
  },
};
