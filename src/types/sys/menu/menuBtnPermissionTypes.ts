export interface MenuBtnPermissionState {
  menuBtnPermissionAddRef: any;
  sysMenuId: string;
  sysMenuTitle: string;
  menuBtnVisible: boolean;
  menuBtnPermissions: any[];
}
export interface MenuBtnPermissionForm {
  sysMenuId?: string;
  pid?: string;
  title?: string;
  permissions?: string;
  type?: number;
  sort?: number;
  status?: number;
}

export interface MenuBtnPermissionAddOrEditState {
  formRef: any;
  visible: boolean;
  loading: boolean;
  form: MenuBtnPermissionForm;
}
