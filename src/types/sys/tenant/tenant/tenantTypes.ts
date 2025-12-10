import { ResponseData } from '@/types/global';

export interface TenantPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Tenant {
  sysTenantId: string;
  tenantName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: number;
  expireTime: any;
  remark?: string;
  username?: string;
  password?: string;
  sysTenantPackageId: string;
  createTime: any;
}
export interface TenantState {
  addEditRef: any;
  ruleFormRef: any;
  list: Tenant[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: TenantPageParams;
}

export interface TenantListRes extends ResponseData {
  list: Tenant[];
  total: number;
}

export interface TenantAddOrEditForm {
  sysTenantId: string;
  tenantName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: number;
  expireTime: any;
  remark?: string;
  username?: string;
  password?: string;
  sysTenantPackageId: string;
}

// 定义状态类型
export interface TenantAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: TenantAddOrEditForm;
}
