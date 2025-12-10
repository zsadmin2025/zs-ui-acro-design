import { ResponseData } from '@/types/global';

export interface TenantPackagePageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface TenantPackage {
  sysTenantPackageId: string;
  packageCode: string;
  packageName: string;
  price: any;
  maxUser: number;
  maxStorage: number;
  menuIdList: any[];
  status: number;
}
export interface TenantPackageState {
  addEditRef: any;
  ruleFormRef: any;
  list: TenantPackage[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: TenantPackagePageParams;
}

export interface TenantPackageListRes extends ResponseData {
  list: TenantPackage[];
  total: number;
}

export interface TenantPackageAddOrEditForm {
  sysTenantPackageId: string;
  packageCode: string;
  packageName: string;
  price: any;
  maxUser: number;
  maxStorage: number;
  menuIdList: any[];
  status: number;
}

// 定义状态类型
export interface TenantPackageAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: TenantPackageAddOrEditForm;
}
