import { ResponseData } from '@/types/global';

export interface InfoApprovalFormPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface InfoApprovalForm {
  caseInfoApprovalFormId: string;
  caseInfoId: string;
  caseNo: string;
  caseType: string;
  customerName: string;
  litigationStatus: string;
  causeAction: string;
  otherSide: string;
  otherLitigationStatus: string;
  thirdParty: string;
  conflictInterest: number;
  subjectAmount: any;
  indicateLawyer: string;
  indicateLawyerName: string;
  appointLawyer: string;
  appointLawyerName: string;
  acceptingCourt: string;
  entrustRequire: string;
  entrustedMattersAbstract: string;
  undertakeLawyerOpinion: string;
  feeAmount: any;
  approvalOpinion: string;
  applicant: string;
  applicantName: string;
  approvalTime: string;
  approvalStatus: number;
}
export interface InfoApprovalFormState {
  addEditRef: any;
  ruleFormRef: any;
  list: InfoApprovalForm[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: InfoApprovalFormPageParams;
}

export interface InfoApprovalFormListRes extends ResponseData {
  list: InfoApprovalForm[];
  total: number;
}

export interface InfoApprovalFormAddOrEditForm {
  caseInfoApprovalFormId: string;
  caseInfoId: string;
  caseNo: string;
  caseType: string;
  customerName: string;
  litigationStatus: string;
  causeAction: string;
  otherSide: string;
  otherLitigationStatus: string;
  thirdParty: string;
  conflictInterest: number;
  subjectAmount: number;
  indicateLawyer: string;
  indicateLawyerName: string;
  appointLawyer: string;
  appointLawyerName: string;
  acceptingCourt: string;
  entrustRequire: string;
  entrustedMattersAbstract: string;
  undertakeLawyerOpinion: string;
  feeAmount: number;
  approvalOpinion: string;
  applicant: string;
  applicantName: string;
  approvalStatus: number;
}

// 定义状态类型
export interface InfoApprovalFormAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: InfoApprovalFormAddOrEditForm;
}
