import { ResponseData } from '@/types/global';

export interface SmsTemplatePageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface SmsTemplate {
  sysSmsTemplateId: string;
  templateNumber: string;
  channel: string;
  signName: string;
  templateCode: string;
  templateContent: string;
  creator: string;
  updater: string;
  creatorDept: string;
  tenantId: string;
}
export interface SmsTemplateState {
  addEditRef: any;
  ruleFormRef: any;
  smsSendRef: any;
  list: SmsTemplate[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: SmsTemplatePageParams;
}

export interface TemplateListRes extends ResponseData {
  list: SmsTemplate[];
  total: number;
}

export interface SmsTemplateAddOrEditForm {
  sysSmsTemplateId: string;
  templateNumber: string;
  channel: string;
  signName: string;
  templateCode: string;
  templateContent: string;
  creator: string;
  createTime: any;
  updater: string;
  updateTime: any;
  creatorDept: string;
  tenantId: string;
}

// 定义状态类型
export interface SmsTemplateAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: SmsTemplateAddOrEditForm;
}
