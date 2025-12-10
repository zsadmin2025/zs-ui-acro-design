import { ResponseData } from '@/types/global';
import { User } from '@/types/sys/user/userTypes';

export interface MessagesPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Messages {
  sysMessageId: string;
  type: number;
  senderId: string;
  receiverId: string;
  title: string;
  content: string;
  isRead: number;
  readTime: any;
  createTime: string;
  senderUser?: User;
}
export interface MessagesState {
  addEditRef: any;
  ruleFormRef: any;
  list: Messages[];
  total: number;
  unReadCount: number;
  loading: boolean;
  selectedKeys: number[];
  form: MessagesPageParams;
}

export interface MessagesListRes extends ResponseData {
  list: Messages[];
  total: number;
}

export interface MessagesAddOrEditForm {
  sysMessageId: string;
  type: number;
  senderId: string;
  receiverId: string;
  receiverName: string;
  title: string;
  content: string;
  readTime: any;
}

// 定义状态类型
export interface MessagesAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: MessagesAddOrEditForm;
}
