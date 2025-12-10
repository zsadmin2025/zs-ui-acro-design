import axios from 'axios';

// ========== 字典类型 API ==========

export const sysDictTypeApi = {
  // 分页查询字典类型
  dictTypePage(params: any) {
    return axios.get('/system/sys/dictType/page', { params });
  },
  // 查询所有字典类型列表
  getDictTypeList() {
    return axios.get('/system/sys/dictType/list');
  },
  // 根据ID获取字典类型
  getDictTypeById(id: string) {
    return axios.get(`/system/sys/dictType/${id}`);
  },
  // 保存字典类型
  dictTypeSave(data: any) {
    return axios.post('/system/sys/dictType/save', data);
  },
  // 更新字典类型
  dictTypeEdit(data: any) {
    return axios.put('/system/sys/dictType/update', data);
  },
  // 删除字典类型
  deleteDictTypeApi(id: string) {
    return axios.delete(`/system/sys/dictType/${id}`);
  },
};

// ========== 字典数据 API ==========

export const sysDictDataApi = {
  // 分页查询字典数据
  dictDataPage(params: any) {
    return axios.get('/system/sys/dictData/page', { params });
  },
  // 获取所有字典数据列表
  getDictMapList() {
    return axios.get('/system/sys/dictData/list');
  },
  // 根据字典类型获取字典数据列表
  getDictDataList(params?: any) {
    return axios.get('/system/sys/dictData/dictType/list', { params });
  },
  // 根据ID获取字典数据
  getDictDataById(id: string) {
    return axios.get(`/system/sys/dictData/${id}`);
  },
  // 保存字典数据
  dictDataSave(data: any) {
    return axios.post('/system/sys/dictData/save', data);
  },
  // 更新字典数据
  dictDataEdit(data: any) {
    return axios.put('/system/sys/dictData/update', data);
  },
  // 删除字典数据
  dictDataDelete(id: string) {
    return axios.delete(`/system/sys/dictData/${id}`);
  },
  // 批量删除字典数据
  batchDel(data: any) {
    return axios.delete('/system/sys/dictData', {
      data,
    });
  },
  // 导出 Excel
  exportExcel(params: any) {
    return axios.get('/system/sys/dictData/export', {
      params,
      responseType: 'blob',
    });
  },
};
