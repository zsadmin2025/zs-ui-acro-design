import { ResponseData } from '@/types/global';

export interface SmsRecordPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface SmsRecord {
  sysSmsRecordId: string;
  templateNumber: string;
  requestId: string;
  bizId: string;
  phoneNumbers: string;
  content: string;
  templateCode: string;
  templateParams: string;
  channel: string;
  status: string;
  sendTime: any;
  creator: string;
  updater: string;
  creatorDept: string;
  tenantId: string;
}
export interface SmsRecordState {
  addEditRef: any;
  ruleFormRef: any;
  list: SmsRecord[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: SmsRecordPageParams;
}

export interface SmsRecordListRes extends ResponseData {
  list: SmsRecord[];
  total: number;
}
