import { ResponseData } from '@/types/global';

export interface ListPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface List {
  caseListId: string;
  caseType: string;
  fileName: string;
  fileOriginalName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  isRequired: number;
}
export interface ListState {
  addEditRef: any;
  ruleFormRef: any;
  list: List[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: ListPageParams;
}

export interface ListListRes extends ResponseData {
  list: List[];
  total: number;
}

export interface ListAddOrEditForm {
  caseListId: string;
  caseType: string;
  fileName: string;
  fileOriginalName: string;
  fileSize: number | undefined;
  fileType: string;
  fileUrl: string;
  isRequired: number;
}

// 定义状态类型
export interface ListAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: ListAddOrEditForm;
  filesList: any[];
}
