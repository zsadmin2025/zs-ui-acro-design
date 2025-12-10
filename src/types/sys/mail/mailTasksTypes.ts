import { ResponseData } from '@/types/global';

export interface MailTasksPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface MailTasks {
  sysMailTasksId: string;
  subject: string;
  content: string;
  sender: string;
  senderName: string;
  recipients: string;
  cc: string;
  bcc: string;
  templateId: string;
  status: number | null;
}
export interface MailTasksState {
  addEditRef: any;
  ruleFormRef: any;
  list: MailTasks[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: MailTasksPageParams;
}

export interface MailTasksListRes extends ResponseData {
  list: MailTasks[];
  total: number;
}

export interface MailTasksAddOrEditForm {
  sysMailTasksId: string;
  subject: string;
  content: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  templateId: string;
  status: number | null;
}

// 定义状态类型
export interface MailTasksAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  sendLoading: boolean;
  formRef: any;
  form: MailTasksAddOrEditForm;
}
