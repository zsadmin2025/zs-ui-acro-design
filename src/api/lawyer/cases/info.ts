import axios from 'axios';

import qs from 'qs';

export const caseInfoApi = {
  // 获取分页数据
  page(params: any) {
    return axios.get('/lawyer/cases/info/page', {
      params,
      paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    });
  },
  // 跟进获取分页数据
  followPage(params: any) {
    return axios.get('/lawyer/cases/info/followUp/page', {
      params,
      paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    });
  },
  // 结案获取分页数据
  closedPage(params: any) {
    return axios.get('/lawyer/cases/info/closed/page', {
      params,
      paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    });
  },
  // 归档获取分页数据
  filingPage(params: any) {
    return axios.get('/lawyer/cases/info/filing/page', {
      params,
      paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    });
  },
  // 作废获取分页数据
  cancelPage(params: any) {
    return axios.get('/lawyer/cases/info/cancel/page', {
      params,
      paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    });
  },

  // 获取列表
  getList(params: any) {
    return axios.get('/lawyer/cases/info/list', { params });
  },

  // 根据ID获取
  getById(id: string) {
    return axios.get(`/lawyer/cases/info/${id}`);
  },

  // 新增
  save(data: any) {
    return axios.post('/lawyer/cases/info/save', data);
  },

  // 编辑
  edit(data: any) {
    return axios.put('/lawyer/cases/info/update', data);
  },

  // 删除单个
  delete(id: string) {
    return axios.delete(`/lawyer/cases/info/${id}`);
  },

  // 批量删除
  batchDel(data: any) {
    return axios.delete('/lawyer/cases/info', { data });
  },

  // 导出数据为Excel
  exportExcel(params: any) {
    return axios.get('/lawyer/cases/info/export', {
      params,
      responseType: 'blob',
    });
  },

  // 审批通过
  approvePass(data: any) {
    return axios.post('/lawyer/cases/info/approvePass', data);
  },
  // 审批拒绝
  approveReject(data: any) {
    return axios.post('/lawyer/cases/info/approveReject', data);
  },

  // 结案
  closed(data: any) {
    return axios.post('/lawyer/cases/info/closed', data);
  },
  // 归档
  filing(data: any) {
    return axios.post('/lawyer/cases/info/filing', data);
  },
  // 作废
  cancel(data: any) {
    return axios.post('/lawyer/cases/info/cancel', data);
  },
  // 恢复
  restore(data: any) {
    return axios.post('/lawyer/cases/info/restore', data);
  },
  // 委托书
  savePowerAttorney(data: any) {
    return axios.post('/lawyer/cases/info/powerAttorney/save', data);
  },

  // 获取案件统计
  getCaseInfoNum() {
    return axios.get('/lawyer/cases/info/statistic/caseInfoNum');
  },
  // 近三个月登记的案件
  getRecentThreeMonthRegisteredCase() {
    return axios.get(
      '/lawyer/cases/info/statistic/recentThreeMonthRegisteredCase',
    );
  },
  // 近1个月待开庭案件
  getrecentOneMonthHearingCase() {
    return axios.get('/lawyer/cases/info/statistic/recentOneMonthHearingCase');
  },
};
