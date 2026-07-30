import { ResponseData } from '@/types/global';

export interface ContactCategoryPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface ContactCategory {
  contactCategoryId: string;
  pid: string;
  pids: string;
  categoryName: string;
  isPublic: string;
  remark: string;
  creator: string;
  updater: string;
  creatorDept: string;
  tenantId: string;
}
export interface ContactCategoryState {
  addEditRef: any;
  ruleFormRef: any;
  list: ContactCategory[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: ContactCategoryPageParams;
}

export interface ContactCategoryListRes extends ResponseData {
  list: ContactCategory[];
  total: number;
}

export interface ContactCategoryAddOrEditForm {
  contactCategoryId: string;
  pid: string;
  pids: string;
  categoryName: string;
  isPublic: string;
  remark: string;
  creator: string;
  createTime: any;
  updater: string;
  updateTime: any;
  creatorDept: string;
  tenantId: string;
}

// 定义状态类型
export interface ContactCategoryAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: ContactCategoryAddOrEditForm;
}
