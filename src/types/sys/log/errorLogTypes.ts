import { ResponseData } from '@/types/global';

export interface ErrorLogPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface ErrorLog {
  username: string;
  module: string;
  ipAddress: string;
  exceptionType: string;
  exceptionMessage: string;
  requestMethod: string;
  requestPath: string;
  requestParams: string;
  createTime: any;
}
export interface ErrorLogState {
  addEditRef: any;
  ruleFormRef: any;
  list: ErrorLog[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: ErrorLogPageParams;
}

export interface ErrorLogListRes extends ResponseData {
  list: ErrorLog[];
  total: number;
}
