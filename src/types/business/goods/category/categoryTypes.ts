import { ResponseData } from '@/types/common/global';

export interface CategoryPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Category {
  categoryId: string;
  categoryName: string;
  status: number;
  remark: string;
}
export interface CategoryState {
  addEditRef: any;
  ruleFormRef: any;
  list: Category[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: CategoryPageParams;
  goodsCategoryList: Category[];
}

export interface CategoryListRes extends ResponseData {
  list: Category[];
  total: number;
}

export interface CategoryAddOrEditForm {
  categoryId: string;
  categoryName: string;
  status: number;
  remark?: string;
}

// 定义状态类型
export interface CategoryAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: CategoryAddOrEditForm;
}
