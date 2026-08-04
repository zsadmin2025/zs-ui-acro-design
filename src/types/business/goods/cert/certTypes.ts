import { ResponseData } from '@/types/common/global';

export interface CertPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Cert {
  drugGoodsCertId: string;
  drugGoodsId: string;
  certName: string;
  certNo: string;
  validEndDate: any;
  fileUrl: string;
}
export interface CertState {
  addEditRef: any;
  ruleFormRef: any;
  list: Cert[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: CertPageParams;
}

export interface CertListRes extends ResponseData {
  list: Cert[];
  total: number;
}

export interface CertAddOrEditForm {
  drugGoodsCertId: string;
  drugGoodsId: string;
  certName: string;
  certNo?: string;
  validEndDate?: any;
  fileUrl?: string;
}

// 定义状态类型
export interface CertAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: CertAddOrEditForm;
}
