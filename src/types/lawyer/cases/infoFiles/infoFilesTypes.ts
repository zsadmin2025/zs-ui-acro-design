import { ResponseData } from '@/types/global';

export interface InfoFilesPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface InfoFiles {
  caseInfoFilesId: string;
  caseInfoId: string;
  caseOtherId: string;
  fileSource: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
}
export interface InfoFilesState {
  addEditRef: any;
  ruleFormRef: any;
  list: InfoFiles[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: InfoFilesPageParams;
}

export interface InfoFilesListRes extends ResponseData {
  list: InfoFiles[];
  total: number;
}

export interface InfoFilesAddOrEditForm {
  caseInfoFilesId: string;
  caseInfoId: string;
  caseOtherId: string;
  fileSource: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
}

// 定义状态类型
export interface InfoFilesAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: InfoFilesAddOrEditForm;
}
