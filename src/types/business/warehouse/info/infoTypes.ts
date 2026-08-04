import { ResponseData } from '@/types/common/global';

export interface InfoPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Info {
  warehouseInfoId: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseAddress: string;
  institutionId: string;
  warehouseArea: any;
  warehouseType: string;
  locationCount: number;
  shelfCount: number;
  managerUserId: string;
  contactInfo: string;
  status: number;
  remark: string;
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

export interface InfoAddOrEditForm {
  warehouseInfoId: string;
  warehouseCode?: string;
  warehouseName?: string;
  warehouseAddress?: string;
  institutionId?: string;
  warehouseArea?: any;
  warehouseType?: string;
  locationCount?: number;
  shelfCount?: number;
  managerUserId?: string;
  contactInfo?: string;
  status?: number;
  remark?: string;
}

// 定义状态类型
export interface InfoAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  form: InfoAddOrEditForm;
}
