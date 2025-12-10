const TOKEN_KEY = 'accessToken';
const REFRESHTOKEN_KEY = 'refreshToken';

const TENANT_KEY = 'tenantId';
const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESHTOKEN_KEY, token);
};
const getRefreshToken = () => {
  return localStorage.getItem(REFRESHTOKEN_KEY);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESHTOKEN_KEY);
};

// ========== 租户相关 ==========

export const getTenantId = () => {
  return localStorage.getItem(TENANT_KEY);
};

export const setTenantId = (tenantName: string) => {
  localStorage.setItem(TENANT_KEY, tenantName);
};

export {
  isLogin,
  getToken,
  setToken,
  setRefreshToken,
  getRefreshToken,
  clearToken,
};
