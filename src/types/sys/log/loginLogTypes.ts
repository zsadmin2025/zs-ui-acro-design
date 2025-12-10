import { ResponseData } from '@/types/global';

export interface LoginPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface LoginLog {
  sysLogLoginId: string;
  username: string;
  ipAddress: string;
  loginTime: any;
  city: string;
  userAgent: string;
  loginStatus: number;
  failureReason: string;
  loginMethod: number;
  loginSource: string;
  browser: string;
  os: string;
  tenantId: string;
}
export interface LoginLogState {
  addEditRef: any;
  ruleFormRef: any;
  list: LoginLog[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: LoginPageParams;
}

export interface LoginLogListRes extends ResponseData {
  list: LoginLog[];
  total: number;
}
