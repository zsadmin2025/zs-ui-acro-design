import { defineStore } from 'pinia';
import { sysUserApi } from '@/api/sys/user';
import { login as userLogin } from '@/api/login/login';
import {
  setToken,
  clearToken,
  setRefreshToken,
  setTenantId,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { sm2Encrypt } from '@/utils/cryptoUtils';
import { useDictDataStore } from '@/store/modules/sys/dict/dictDataStore';
import { UserState, User } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {
      age: undefined,
      avatar: undefined,
      email: undefined,
      ip: undefined,
      ipAddress: undefined,
      isAdmin: undefined,
      lastLoginTime: undefined,
      phone: undefined,
      realName: undefined,
      sex: undefined,
      status: undefined,
      sysDeptId: undefined,
      sysPostId: undefined,
      sysUserId: undefined,
      username: undefined,
    },
    permissions: [],
  }),

  getters: {
    userInfo(state: UserState): User {
      return { ...state.user };
    },
  },

  actions: {
    // Switch roles
    switchRoles() {
      return new Promise((resolve) => {
        this.permissions = [];
        resolve(this.permissions);
      });
    },
    // Reset user's information
    resetInfo() {
      this.$reset();
    },
    async updateUserInfo(userInfo: User) {
      this.user = userInfo;
      await sysUserApi.edit(userInfo);

      this.getUserInfo();
    },
    async updateAvatar(avatar: string) {
      this.user.avatar = avatar;
      await sysUserApi.edit(this.user);
    },
    async getUserInfo() {
      const { data } = await sysUserApi.getById(this.user.sysUserId ?? '');
      Object.assign(this.user, data);
    },
    // Get user's information
    async info() {
      const res = await sysUserApi.getUserInfo();
      this.user = res.data.sysUser;
      this.permissions = res.data.permissions;
    },
    // Login
    async login(loginForm: any) {
      try {
        const data = {
          tenantId: loginForm.tenantId,
          username: loginForm.username,
          password: loginForm.password,
          code: loginForm.code,
          uuid: loginForm.uuid,
        };
        const res = await userLogin({ encrypt: sm2Encrypt(data) });
        setTenantId(loginForm.tenantId);
        setToken(res?.data?.accessToken);
        setRefreshToken(res?.data?.refreshToken);

        // 加载字典数据
        const dictDataStore = useDictDataStore();
        await dictDataStore.loadDictDataList();
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      // 重置用户信息
      this.resetInfo();
      // 清空token
      clearToken();
      // 情况login-config缓存
      //
      removeRouteListener();
      // 清空路由
      appStore.clearServerMenu();
      window.location.reload();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
      // try {
      //   await userLogout(); // 调用接口
      // } finally {
      //   this.logoutCallBack();
      // }
    },
  },
});

export default useUserStore;
