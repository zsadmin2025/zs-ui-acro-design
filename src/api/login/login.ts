import axios from 'axios';

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}
export function login(data: any) {
  return axios.post<LoginRes>('/auth/login', data);
}
// 获取登录验证码
export function getLoginCode() {
  return axios.get('/auth/captcha');
}
export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

// 获取租户列表
export function getTenantSelect() {
  return axios.get('/system/sys/tenant/select');
}
