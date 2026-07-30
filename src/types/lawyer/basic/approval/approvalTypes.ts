import { ResponseData } from '@/types/global';

export interface ApprovalPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Approval {
  approvalConfigurationId: string;
  typeId: number;
  roleId: string;
  creator: string;
  updater: string;
}

export interface ApprovalListRes extends ResponseData {
  list: Approval[];
  total: number;
}

export interface ApprovalAddOrEditForm {
  isApproval: number; // 是否启用审批
  registrationApprovalRoles: [];
  closingApprovalRoles: [];
  usingChapterApprovalRoles: [];
}
export interface ApprovalState {
  loading: boolean;
  form: ApprovalAddOrEditForm;
}

export interface ApprovalUser {
  sysUserId: string;
  realName: string;
}
