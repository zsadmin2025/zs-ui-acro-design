import { ResponseData } from '@/types/global';

export interface ContactPeoplePageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface ContactPeople {
  contactPeopleId: string;
  name: string;
  phone: string;
  sex: string;
  contactCategoryId: string;
  remark: string;
  placeWork: string;
  creator: string;
  updater: string;
  creatorDept: string;
  tenantId: string;
}
export interface ContactPeopleState {
  addEditRef: any;
  ruleFormRef: any;
  list: ContactPeople[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: ContactPeoplePageParams;
}

export interface ContactPeopleListRes extends ResponseData {
  list: ContactPeople[];
  total: number;
}

export interface ContactPeopleAddOrEditForm {
  contactPeopleId: string;
  name: string;
  phone: string;
  sex: string;
  contactCategoryId: string;
  remark: string;
  placeWork: string;
  creator: string;
  createTime: any;
  updater: string;
  updateTime: any;
  creatorDept: string;
  tenantId: string;
}

// 定义状态类型
export interface ContactPeopleAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: ContactPeopleAddOrEditForm;
}
