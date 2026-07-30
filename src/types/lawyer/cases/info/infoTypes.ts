import { ResponseData } from '@/types/global';
import { CustomertAddOrEditForm } from '../customer/customer';
import { ContractAddOrEditForm } from '../contract/contractTypes';
import { HearingAddOrEditForm } from '../hearing/hearing';
import { TeamAddOrEditForm } from '../team/team';
import { RelatedParties } from '../relatedParties/relatedPartiesTypes';
import { InfoFiles } from '../infoFiles/infoFilesTypes';
import { InfoList } from '../infoList/infoListTypes';
import { ApprovalUser } from '../../basic/approval/approvalTypes';
import { InfoApprovalFormAddOrEditForm } from '../infoApprovalForm/infoApprovalFormTypes';

export interface InfoPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Info {
  caseInfoId: string;
  caseName: string;
  caseNo: string;
  caseType: string;
  projectType: string;
  proxyStage: string;
  nowStage: string;
  litigationStatus: string;
  subjectAmount: number;
  applyDate: any;
  applicant: string;
  applicantName: string;
  caseIntroduction: string;
  entrustmentMatters: string;
  powerAttorney?: string;
  isPaperContractSubmitted: number; // 是否提交纸质合同 0-否 1-是
  isScannedContractSubmitted: number; // 是否提交扫描合同 0:否 1:是
  isLetterIssued: number; // 所函是否已开 0-否 1-是
  creator: string;
  updater: string;
}
export interface InfoState {
  addEditRef: any;
  ruleFormRef: any;
  list: Info[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: InfoPageParams;
}

export interface InfoListRes extends ResponseData {
  list: Info[];
  total: number;
}

// 客户信息
export interface CustomerAddOrEditForm {
  // 案件客户信息id
  caseCustomerId: string;
  // 案件id
  caseInfoId: string;
  // 客户状态
  customerType: string;
}

export interface InfoAddOrEditForm {
  // 案件id
  caseInfoId: string;
  // 案件名称
  caseName: string;
  // 案件编号
  caseNo: string;
  // 案件类型
  caseType: string;
  // 立项类型
  projectType: string;
  // 代理阶段
  proxyStage: string[];
  // 当前阶段
  nowStage: string;
  // 诉讼地位
  litigationStatus: string;
  // 主案金额
  subjectAmount: number;
  // 我方
  ourSide: RelatedParties[];
  // 对方
  otherSide: RelatedParties[];
  // 申请时间
  applyDate: any;
  // 申请人
  applicant: string;
  // 申请人名称
  applicantName: string;
  // 申请人电话
  caseIntroduction: string;
  // 委托事项
  entrustmentMatters?: string;
  // 委托书
  powerAttorney?: string;
  // 案件状态
  caseStatus: number;
  // 是否需要审批 0-否 1-是
  isApprove: number;
  // 审批状态  0-拒绝 1-审批中 2-通过
  approveStatus?: number;
  // 审批律师
  approvalLawyer?: number;
  // 审批人
  approvalLawyerName?: string;
  // 审批意见
  approvalOpinion?: string;
}

// 案件信息
export interface CaseInfoAddOrEdit {
  // 客户信息
  caseCustomer: CustomertAddOrEditForm;
  // 案件信息
  caseInfo: InfoAddOrEditForm;
  // 开庭信息
  caseHearingList: HearingAddOrEditForm[];
  // 团队信息
  caseTeam: TeamAddOrEditForm;
  // 合同信息
  caseContract: ContractAddOrEditForm;
  // 案件结案目录
  caseInfoList: InfoList[];
  // 文件信息
  caseInfoFilesList: InfoFiles[];
  // 审批人
  approvalLawyerList: [];
  // 审批表单
  caseInfoApprovalForm?: InfoApprovalFormAddOrEditForm;
}

export interface CaseItem {
  // 客户信息
  caseCustomer: CustomertAddOrEditForm;
  // 案件信息
  caseInfo: InfoAddOrEditForm;
  // 开庭信息
  caseHearingList: HearingAddOrEditForm[];
  // 团队信息
  caseTeam: TeamAddOrEditForm;
  // 合同信息
  caseContract: ContractAddOrEditForm;
  // 案件结案目录
  caseInfoList: InfoList[];
  // 文件信息
  caseInfoFilesList: InfoFiles[];
  // 审批人
  approvalLawyerList: [];
}

// 定义状态类型
export interface InfoAddOrEditState {
  resultShow: boolean;
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  approvalUsers: ApprovalUser[];
  form: CaseInfoAddOrEdit;
}
