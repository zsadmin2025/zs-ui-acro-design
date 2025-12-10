export interface Role {
  sysRoleId: string;
  roleName: string;
  roleCode: string;
  sort: number;
  status: number;
  remark: string;
  menuList: string[];
  dataScope: number;
  deptList: string[];
}

export interface RolePageForm {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}

export interface RoleState {
  addEditRef: any;
  dataScopeRef: any;
  menuPermissionRef: any;
  list: Role[];
  total: number;
  loading: boolean;
  selectedKeys: number[];
  form: RolePageForm;
  roleData: Role[];
}

export interface RoleForm {
  sysRoleId: string;
  roleName: string;
  roleCode: string;
  sort: number;
  status: number;
  remark: string;
  menuList: string[];
  dataScope: number;
  deptList: string[];
}

// 定义状态类型
export interface RoleAddOrEditState {
  dialogFormVisible: boolean;
  dataScopeVisible: boolean;
  menuPermission: boolean;
  treeRef: any;
  deptRef: any;
  formRef: any;
  dataScopeFormRef: any;
  menuPermissionRef: any;
  menuData: any[];
  deptTree: any[];
  form: RoleForm;
}
