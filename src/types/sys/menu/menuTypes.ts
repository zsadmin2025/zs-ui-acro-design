export interface Menu {
  sysMenuId: string;
  pid?: string;
  path?: string;
  name?: string;
  type?: number;
  component?: string;
  visible?: number;
  requiresAuth: boolean;
  icon: string;
  title: string;
  hideInMenu: boolean;
  hideChildrenInMenu: boolean;
  sort: number;
  noAffix: boolean;
  ignoreCache: boolean;
  children?: Menu[];
}
export interface MenuState {
  addEditRef: any;
  btnPermissionsRef: any;
  ruleFormRef: any;
  list: Menu[];
  refreshTable: boolean;
  expand: boolean;
  loading: boolean;
  form: {
    title: '';
  };
}
// export interface meta {
//   requiresAuth: boolean;
//   icon: string;
//   title: string;
//   hideInMenu: boolean;
//   hideChildrenInMenu: boolean;
//   sort: number;
//   noAffix: boolean;
//   ignoreCache: boolean;
// }

export interface MenuForm {
  sysMenuId?: string;
  type?: number;
  pid?: string;
  name?: string;
  path?: string;
  title?: string;
  link?: string;
  component?: string;
  icon?: string;
  permissions?: string;
  sort?: number;
  visible?: number;
  status?: number;
  hideInMenu?: number;
  hideChildrenInMenu?: number;
  noAffix: boolean;
  ignoreCache: boolean;
}

export interface MenuAddOrEditState {
  dialogFormVisible: boolean;
  formRef: any;
  popoverRef: any;
  list: Menu[];
  loading: boolean;
  form: MenuForm;
}
