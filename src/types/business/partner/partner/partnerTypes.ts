import { ResponseData } from '@/types/common/global';

export interface PartnerPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Partner {
  partnerId: string;
  partnerCategoryId: string;
  companyName: string;
  partnerType: string;
  companyAddress: string;
  warehouseAddress: string;
  shortName: string;
  namePinyin: string;
  contactPerson: string;
  companyPhone: string;
  mobile: string;
  fax: string;
  email: string;
  fileNo: string;
  settlementStatus: number;
  settlementPeriod: number;
  status: number;
  socialCreditCode: string;
  validUntil: any;
  bankName: string;
  bankAccount: string;
  companyPrincipal: string;
  principalPhone: string;
  companyManager: string;
  managerPhone: string;
  qualityPrincipal: string;
  qualityPhone: string;
  qualityManager: string;
  qualityManagerPhone: string;
  financePrincipal: string;
  financePhone: string;
  qualityOrgPrincipal: string;
  qualityOrgPhone: string;
}
export interface PartnerState {
  addEditRef: any;
  ruleFormRef: any;
  list: Partner[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: PartnerPageParams;
  partnerList: Partner[];
  supplierList: Partner[];
}

export interface PartnerListRes extends ResponseData {
  list: Partner[];
  total: number;
}

export interface PartnerAddOrEditForm {
  partnerId: string;
  partnerCategoryId: string;
  companyName: string;
  partnerType: string;
  companyAddress: string;
  warehouseAddress: string;
  shortName?: string;
  namePinyin?: string;
  contactPerson?: string;
  companyPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  fileNo?: string;
  settlementStatus?: number;
  settlementPeriod?: number;
  status: number;
  socialCreditCode?: string;
  validUntil?: any;
  bankName?: string;
  bankAccount?: string;
  companyPrincipal?: string;
  principalPhone?: string;
  companyManager?: string;
  managerPhone?: string;
  qualityPrincipal?: string;
  qualityPhone?: string;
  qualityManager?: string;
  qualityManagerPhone?: string;
  financePrincipal?: string;
  financePhone?: string;
  qualityOrgPrincipal?: string;
  qualityOrgPhone?: string;
}

// 定义状态类型
export interface PartnerAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: PartnerAddOrEditForm;
}
