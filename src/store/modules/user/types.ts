export interface User {
  age?: number;
  avatar?: string;
  email?: string;
  ip?: string;
  ipAddress?: string;
  isAdmin?: boolean;
  lastLoginTime?: string;
  phone?: string;
  realName?: string;
  sex?: string;
  status?: string;
  sysDeptId?: string;
  deptName?: string;
  sysPostId?: string;
  postName?: string;
  sysUserId?: string;
  username?: string;
  createTime?: string;
}
export interface UserState {
  user: User;
  permissions?: string[];
}
