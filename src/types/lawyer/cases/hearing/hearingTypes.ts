import { ResponseData } from '@/types/global';

export interface HearingPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Hearing {
  caseHearingId: string;
  caseInfoId: string;
  courtAcceptDate: any;
  hearingProcedure: string;
  courtLawyer: string;
  court: string;
  courtCaseNumber: string;
  judge: string;
  judgePhone: string;
  courtClerk: string;
  courtClerkPhone: string;
  judgmentResult: string;
  serviceByPublicationDate: any;
  judgmentIssuedDate: any;
  judgmentSignDate: any;
  judgmentTakesEffect: any;
  judgmentContent: string;
  followUpSituation: string;
}
export interface HearingState {
  addEditRef: any;
  ruleFormRef: any;
  list: Hearing[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: HearingPageParams;
}

export interface HearingListRes extends ResponseData {
  list: Hearing[];
  total: number;
}

export interface HearingAddOrEditForm {
  caseHearing: string;
  caseInfoId: string;
  courtAcceptDate: any;
  hearingProcedure: string;
  courtLawyer: string;
  court: string;
  courtCaseNumber: string;
  judge: string;
  judgePhone: string;
  courtClerk: string;
  courtClerkPhone: string;
  judgmentResult: string;
  serviceByPublicationDate: any;
  judgmentIssuedDate: any;
  judgmentSignDate: any;
  judgmentTakesEffect: any;
  judgmentContent: string;
  followUpSituation: string;
}

// 定义状态类型
export interface HearingAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: HearingAddOrEditForm;
}
