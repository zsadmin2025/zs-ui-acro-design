// 客户信息
export interface Customer {
  // 客户信息id
  caseCustomerId: string;
  // 案件id
  caseInfoId: string;
  // 客户id
  customerId: string;
  // 客户名称
  customerName: string;
  // 客户编号
  customerCode: string;
  // 客户状态
  customerType: string;
}

// 客户信息
export interface CustomertAddOrEditForm {
  // 客户信息id
  caseCustomerId: string;
  // 案件id
  caseInfoId: string;
  // 客户id
  customerId: string;
  // 客户名称
  customerName: string;
  // 客户编号
  customerCode: string;
  // 客户状态
  customerType: string;
}
