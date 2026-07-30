import { ResponseData } from '@/types/global';
import { User } from '@/types/sys/user/userTypes';

export interface CustomerPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Customer {
  customerId: string;
  customerCategory: string;
  customerNature: string;
  customerName: string;
  customerCode: string;
  customerAbbreviation: string;
  maintainingPeople: string;
  maintainingPeopleName: string;
  sharer: string;
  sharerName: string;
  legalPerson: string;
  credit: string;
  customerSource: string;
  customerGrade: string;
  contactNumber: string;
  wechatNumber: string;
  email: string;
  isConsultant: number;
  bankDeposit: string;
  bankAccount: string;
  customerAddress: string;
  inputPerson: number;
  inputPersonName: string;
  inputTime: any;
  industryCategory: string;
  industryCategoryName: string;
  establishedTime: any;
  postalCode: string;
  faxNumber: string;
  registeredCapital: string;
  shareholding: string;
  companyManagement: string;
  businessScope: string;
  creator: string;
  updater: string;
}
export interface CustomerState {
  addEditRef: any;
  ruleFormRef: any;
  list: Customer[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: CustomerPageParams;
  customerList: Customer[];
}

export interface CustomerListRes extends ResponseData {
  list: Customer[];
  total: number;
}

export interface CustomerAddOrEditForm {
  customerId: string;
  customerCategory: string;
  customerNature: string;
  customerName: string;
  customerAbbreviation: string;
  maintainingPeople: string[];
  maintainingPeopleName: string;
  sharer: string[];
  sharerName: string;
  legalPerson: string;
  credit: string;
  customerSource: string;
  customerGrade: string;
  contactNumber: string;
  wechatNumber: string;
  email: string;
  isConsultant?: number;
  bankDeposit: string;
  bankAccount: string;
  customerAddress: string;
  inputPerson?: number;
  inputPersonName: string;
  inputTime: any;
  industryCategory: string;
  industryCategoryName: string;
  establishedTime: any;
  postalCode: string;
  faxNumber: string;
  registeredCapital: string;
  shareholding: string;
  companyManagement: string;
  businessScope: string;
}

// 定义状态类型
export interface CustomerAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  userList: User[];
  form: CustomerAddOrEditForm;
}
