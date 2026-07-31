import { ResponseData } from '@/types/global';

export interface JobPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Job {
  sysJobId: string;
  jobName: string;
  jobGroup: string;
  cronExpression: string;
  status: number;
  remark: string;
  jobClass: string;
  creator: string;
  updater: string;
  creatorDept: string;
  tenantId: string;
}
export interface JobState {
  addEditRef: any;
  ruleFormRef: any;
  logRef: any;
  list: Job[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: JobPageParams;
}

export interface JobListRes extends ResponseData {
  list: Job[];
  total: number;
}

export interface JobAddOrEditForm {
  sysJobId: string;
  jobName: string;
  jobGroup: string;
  cronExpression: string;
  status: number;
  remark: string;
  jobClass: string;
}

// 定义状态类型
export interface JobAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: JobAddOrEditForm;
}
