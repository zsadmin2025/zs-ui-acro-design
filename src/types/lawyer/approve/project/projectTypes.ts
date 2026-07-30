import { Customer } from '@/types/lawyer/cases/customer/customer';
import { InfoAddOrEditForm } from '@/types/lawyer/cases/info/infoTypes';
import { Hearing } from '@/types/lawyer/cases/hearing/hearing';
import { Team } from '@/types/lawyer/cases/team/team';

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

export interface ApproveInfo {
  // 客户信息
  caseCustomer: Customer;
  // 案件信息
  caseInfo: InfoAddOrEditForm;
  // 开庭信息
  caseHearingList: Hearing[];
  // 团队信息
  caseTeam: Team;
}

export interface projectDetailState {
  loading: boolean;
  formRef: any;
  form: ApproveInfo;
}
