import { ResponseData } from '@/types/global';

export interface Dept {
  sysDeptId?: string;
  pid?: string;
  deptName?: string;
  remark?: string;
  sysUserId?: string;
  deptHeadName?: string;
  status?: number;
  sort?: number;
}

export interface DeptPageParams {
  current: number;
  pageSize: number;
  [key: string]: any;
}
export interface DeptState {
  addEditRef: any;
  ruleFormRef: any;
  deptTreeData: [];
  refreshTable: boolean;
  expand: boolean;
  loading: boolean;
  expandedKeys: string[];
  form: {
    sysDeptId: string;
    deptName: string | null;
  };
  total: number;
  list: Dept[];
  dataForm: DeptPageParams;
  deptPostTreeData: any[];
}

export interface DeptListRes extends ResponseData {
  list: Dept[];
  total: number;
}

export interface DeptForm {
  sysDeptId: string;
  pid: string;
  deptName: string;
  deptHeadId: string;
  deptHeadName: string;
  status: number;
  sort: number;
  remark: string;
}

export interface DeptAddOrEditState {
  dialogFormVisible: boolean;
  formRef: any;
  deptHeadRef: any;
  treeData: any[];
  loading: boolean;
  form: DeptForm;
}
