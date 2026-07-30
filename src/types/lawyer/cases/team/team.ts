// 案件团体信息
export interface Team {
  // 案件团队id
  caseTeamId: string;
  // 案件id
  caseInfoId: string;
  // 承接律师
  undertakeLawyer: string;
  // 协接律师
  coordinatingLawyer: string[];
  // 主办律师
  leadLawyer: string[];
  // 协办人员
  coOrganizer: string[];
  // 助理
  assistant: string[];
  // 秘书
  secretary: string[];
}

export interface TeamAddOrEditForm {
  // 案件团队id
  caseTeamId: string;
  // 案件id
  caseInfoId: string;
  // 承接律师
  undertakeLawyer: string;
  // 协接律师
  coordinatingLawyer: string[];
  // 主办律师
  leadLawyer: string[];
  // 协办人员
  coOrganizer: string[];
  // 助理
  assistant: string[];
  // 秘书
  secretary: string[];
}
