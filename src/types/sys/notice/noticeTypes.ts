import { ResponseData } from '@/types/global';

export interface sysNoticeDetailsVOs {
  sysNoticeDetailsId: string;
  sysNoticeId: string;
  receiverId: string;
  realName?: string;
  status: number;
  readTime?: any;
}

export interface NoticePageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Notice {
  sysNoticeId: string;
  title: string;
  content: string;
  type: number;
  level: number;
  status: number;
  releaseTime: any;
}
export interface NoticeState {
  addEditRef: any;
  infoRef: any;
  ruleFormRef: any;
  list: Notice[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: NoticePageParams;
}

export interface NoticeListRes extends ResponseData {
  list: Notice[];
  total: number;
}

export interface NoticeAddOrEditForm {
  sysNoticeId: string;
  title: string;
  content: string;
  type: number;
  level: number;
  status: number;
  receivingType: number; // 接收者类型
  receiverIds: string[];
  releaseTime: any;
  files: any[];
  sysNoticeDetailsVOs: any[];
  createTime: any;
  updateTime?: any;
}

// 定义状态类型
export interface NoticeAddOrEditState {
  dialogFormVisible: boolean;
  noticeInfoVisible: boolean;
  loading: boolean;
  formRef: any;
  form: NoticeAddOrEditForm;
}
