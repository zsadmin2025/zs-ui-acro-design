import { ResponseData } from '@/types/global';

export interface LogOperationPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface LogOperation {
  sysLogOperationId: string;
  username: string;
  module: string;
  ipAddress: string;
  operationType: string;
  operationDescription: string;
  requestMethod: string;
  requestPath: string;
  requestParams: string;
  responseStatusCode: number;
  responseMessage: string;
  operationDuration: number;
}
export interface LogOperationState {
  addEditRef: any;
  ruleFormRef: any;
  list: LogOperation[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: LogOperationPageParams;
}

export interface LogOperationListRes extends ResponseData {
  list: LogOperation[];
  total: number;
}
