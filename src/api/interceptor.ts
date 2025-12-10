import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken, getTenantId } from '@/utils/auth';
import randomSm4Key from '@/utils/randomUtils';
import cryptoStore from '@/store/modules/common/cryptoStore';
import { sm2Encrypt } from '@/utils/cryptoUtils';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

axios.defaults.timeout = 20000; // 请求超时 20s

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 租户
    config.headers['X-Tenant-Id'] = getTenantId();
    // 登录接口，添加sm4key
    if (config.url === '/auth/login') {
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders();
      }
      // 生成随机sm4key
      cryptoStore().setSm4Key(randomSm4Key());
      // 添加sm4key到请求头
      config.headers.cryptoKey = sm2Encrypt(cryptoStore().sm4Key);
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  },
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 二进制数据则直接返回
    // 二进制数据则直接返回
    if (
      response.config.responseType === 'blob' ||
      response.config.responseType === 'arraybuffer' ||
      response.config.responseType === 'text'
    ) {
      return response;
    }

    const res = response.data;
    if (res.code === 200) {
      return res;
    }
    Message.error({
      content: res?.msg || '网络连接异常,请检查网络情况。',
      duration: 5 * 1000,
    });

    // 可以抛出错误，进入 catch
    return Promise.reject(new Error(res.msg || '请求失败'));
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const status: number = error.response?.status;
    const message: any =
      {
        400: '请求错误',
        401: '未授权，请登录',
        403: '拒绝访问',
        404: `请求地址出错: ${error.response?.config.url}`,
        408: '请求超时',
        500: '服务器内部错误',
        501: '服务未实现',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
        505: 'HTTP版本不受支持',
      }[status] || '网络连接异常,请检查网络情况。';

    Message.error({
      content: message || 'Request Error',
      duration: 5 * 1000,
    });
    if (status === 401) {
      useUserStore().logout();
    }

    return Promise.reject(error);
  },
);
