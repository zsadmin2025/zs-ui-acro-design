// 案件三方信息
export interface RelatedParties {
  // 案件三方信息id
  caseRelatedPartiesId: string;
  //
  caseInfoId: string;
  // our_side我方 other_side对方third_party三方
  role: string;
  // 关联方类型
  relationType: string;
  // 关联方名称
  relatedName: string;
}
