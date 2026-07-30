import { ResponseData } from '@/types/global';

export interface InfoListPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface InfoList {
  basicFileName: any;
  caseInfoListId: string;
  caseInfoId: string;
  caseListId: string;
  caseListFileName: string;
  caseListFileUrl: string;
  fileName: string;
  fileUrl: string;
}
export interface InfoListState {
  addEditRef: any;
  ruleFormRef: any;
  list: InfoList[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: InfoListPageParams;
}

export interface InfoListListRes extends ResponseData {
  list: InfoList[];
  total: number;
}

export interface InfoListAddOrEditForm {
  caseInfoListId: string;
  caseInfoId: string;
  caseListId: string;
  caseListFileName: string;
  caseListFileUrl: string;
  fileName: string;
  fileUrl: string;
}

// 定义状态类型
export interface InfoListAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: InfoListAddOrEditForm;
}
