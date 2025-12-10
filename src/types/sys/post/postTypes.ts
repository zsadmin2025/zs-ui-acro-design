import { ResponseData } from '@/types/global';

export interface PostPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}
export interface Post {
  sysPostId: string;
  postName: string;
  postCode: string;
  sysDeptId: string;
  sort: number;
  status: number;
  remark: string;
}
export interface PostState {
  addEditRef: any;
  ruleFormRef: any;
  list: Post[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  deptTreeData: [];
  expandedKeys: [];
  form: PostPageParams;
  postList: Post[];
}

export interface PostListRes extends ResponseData {
  list: Post[];
  total: number;
}

export interface PostAddOrEditForm {
  sysPostId: string;
  postName: string;
  sysDeptId: string;
  sort: number;
  status: number;
  remark: string;
}

// 定义状态类型
export interface PostAddOrEditState {
  dialogFormVisible: boolean;
  loading: boolean;
  formRef: any;
  deptTreeData: [];
  form: PostAddOrEditForm;
}
