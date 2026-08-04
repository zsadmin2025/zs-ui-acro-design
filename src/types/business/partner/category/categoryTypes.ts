import { ResponseData } from '@/types/common/global';

export interface CategoryPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Category {
  businessPartnerCategoryId: string;
  partnerCategoryName: string;
  status: number;
  remark: string;
}
export interface CategoryAddOrEditForm {
  businessPartnerCategoryId: string;
  partnerCategoryName?: string;
  status: number;
  remark?: string;
}

export interface CategoryState {
  addEditRef: any;
  ruleFormRef: any;
  list: Category[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: CategoryPageParams;

  partnerCategoryList: Category[];
}

export interface CategoryListRes extends ResponseData {
  list: Category[];
  total: number;
}

// 定义状态类型
export interface CategoryAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: CategoryAddOrEditForm;
}
