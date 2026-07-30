import { InfoFiles } from '@/types/lawyer/cases/infoFiles/infoFilesTypes';

// 合同节点信息
export interface ContractNode {
  // 案件合同节点id
  caseContractNodeId: string;
  // 案件id
  caseInfoId: string;
  // 案件合同id
  caseContractId: string;
  // 款项类别
  paymentCategory: string;
  // 款项名称
  paymentName: string;
  // 应收金额
  receivableAmount: number;
  // 预计收款日期
  expectedCollectionDate: any;
  // 收款条件
  paymentTerms: string;
}

// 合同信息
export interface ContractAddOrEditForm {
  // 合同ID
  caseContractId: string;
  // 案件ID
  caseInfoId: string;
  // 合同起始日期
  startDate: any;
  endDate?: any;
  // 合同金额
  contractAmount: number;
  // 付款方式
  paymentMethod: string;
  // 付款方式明细
  paymentMethodDetails: string;
  // 合同节点
  contractNodeList: ContractNode[];
  // 合同文件
  contractFileList: InfoFiles[];
}
