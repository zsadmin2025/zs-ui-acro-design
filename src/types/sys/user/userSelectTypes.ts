export interface UserSelectPageParams {
  current: number;
  pageSize: number;
  [key: string]: any; // 支持额外参数
}

export interface UserSelectState {
  total: number;
  form: UserSelectPageParams;
  tableData: any[];
  tableAddUserData: any[];
  selectedUser: any[];
}
