import { InfoFiles } from '../infoFiles/infoFilesTypes';

// 案件开庭信息
export interface Hearing {
  // 案件开庭id
  caseHearingId: string;
  // 案件id
  caseInfoId: string;
  // 法院受理日期
  courtAcceptDate: any;
  // 审理程序
  hearingProcedure: string;
  // 开庭律师
  courtLawyer: string;
  // 法院/仲裁委员会
  court: string;
  // 法院案号
  courtCaseNumber: string;
  // 法官
  judge: string;
  // 法官电话
  judgePhone: string;
  // 书记员
  courtClerk: string;
  // 书记员电话
  courtClerkPhone: string;
  // 判决结果
  judgmentResult: string;
  // 公告送达时间
  serviceByPublicationDate: any;
  // 判决签发时间
  judgmentIssuedDate: any;
  // 判决签收时间
  judgmentSignDate: any;
  // 判决生效时间
  judgmentTakesEffect: any;
  // 判决内容
  judgmentContent: string;
  // 跟进情况
  followUpSituation: string;
  // 案件开庭附件
  caseHearingFilesList: InfoFiles[];
}

// 案件开庭信息
export interface HearingAddOrEditForm {
  // 案件开庭id
  caseHearingId: string;
  // 案件id
  caseInfoId: string;
  // 法院受理日期
  courtAcceptDate: any;
  // 审理程序
  hearingProcedure: string;
  // 开庭时间
  courtTime: string;
  // 开庭律师
  courtLawyer: string;
  // 法院/仲裁委员会
  court: string;
  // 法院案号
  courtCaseNumber: string;
  // 法官
  judge: string;
  // 法官电话
  judgePhone: string;
  // 书记员
  courtClerk: string;
  // 书记员电话
  courtClerkPhone: string;
  // 判决结果
  judgmentResult: string;
  // 公告送达时间
  serviceByPublicationDate: any;
  // 判决签发时间
  judgmentIssuedDate: any;
  // 判决签收时间
  judgmentSignDate: any;
  // 判决生效时间
  judgmentTakesEffect: any;
  // 判决内容
  judgmentContent: string;
  // 跟进情况
  followUpSituation: string;
  // 案件开庭附件
  caseHearingFilesList: InfoFiles[];
}

// 定义状态类型
export interface HearingAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: HearingAddOrEditForm;
}
