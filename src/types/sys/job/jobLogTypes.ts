import { ResponseData } from '@/types/global';

export interface JobLogPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface JobLog {
  sysJobLogId: string;
  sysJobId: string;
  jobClass: string;
  jobName: string;
  jobGroup: string;
  jobMessage: string;
  status: number;
  exceptionInfo: string;
  startTime: any;
  endTime: any;
  duration: number;
}
export interface JobLogState {
  dialogFormVisible: boolean;
  jobLogList: JobLog[];
  loading: boolean;
  total: number;
  form: JobLogPageParams;
}
export interface JobLogListRes extends ResponseData {
  list: JobLog[];
  total: number;
}
