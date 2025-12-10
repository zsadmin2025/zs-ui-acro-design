import { ResponseData } from '@/types/global';

// 用户相关类型定义
export interface User {
  sysUserId: string;
  username?: string;
  realName?: string;
  avatar?: string;
  email?: string;
  sex: number;
  phone?: string;
  deptName?: string;
  postName?: string;
}

export interface UserPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}

export interface UserState {
  addEditRef: any;
  ruleFormRef: any;
  expandedKeys: number[];
  list: User[];
  total: number;
  deptTreeData: any[];
  loading: boolean;
  form: UserPageParams;
  resetPasswordVisible: boolean;
  passwordFormRef: any;
  passwordForm: any;
  selectedKeys: any[];
  userList: User[];
}
export interface UserInfo {
  sysUser: any;
  permissions: any[];
}

export interface UserListRes extends ResponseData {
  list: User[];
  total: number;
}

export interface UserForm {
  sysUserId: string;
  avatar: string;
  username: string;
  password: string;
  realName: string;
  sex: number;
  age: number;
  phone: string;
  email: string;
  employeeNumber: string;
  sysDeptId: string;
  sysPostId: string;
  deptPostList: any[];
  roleIdList: string[];
  status: number;
}
export interface UserAddOrEditState {
  dialogFormVisible: boolean;
  formRef: any;
  deptRef: any;
  treeSelectRef: any;
  deptTableRef: any;
  deptTree: any;
  postData: any;
  deptPostData: any;
  roleData: any;
  deptPostTableData: any;
  loading: boolean;
  imageUrl: string;
  form: UserForm;
}
