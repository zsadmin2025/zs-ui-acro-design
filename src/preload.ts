/**
 * 应用预加载模块
 * 在 Vue 挂载前并行加载关键数据（用户信息、菜单配置），缩短首屏等待时间
 */
import { ref } from 'vue';
import { useUserStore, useAppStore } from '@/store';
import { getToken, clearToken } from '@/utils/auth';

// 全局 loading 状态，控制首页 Loading 显示
export const isPreloading = ref(true);

// 预加载 Promise，供路由守卫等待
let preloadPromise: Promise<void> | null = null;

/**
 * 获取预加载 Promise
 * 路由守卫可以通过 await waitForPreload() 等待预加载完成
 */
export function waitForPreload(): Promise<void> {
  return preloadPromise ?? Promise.resolve();
}

export function preload() {
  if (!getToken()) {
    isPreloading.value = false;
    // 无 token 时也标记为已获取，避免路由守卫无限等待
    useAppStore().hasFetchedMenus = true;
    return;
  }

  preloadPromise = Promise.all([
    useUserStore().info(),
    useAppStore().fetchServerMenuConfig(),
  ])
    .then(() => {
      // 预加载成功，fetchServerMenuConfig 内部已设置 hasFetchedMenus = true
    })
    .catch((error) => {
      // 预加载失败（如 401 未授权），清除无效 token
      // eslint-disable-next-line no-console
      console.warn('预加载失败，清除无效 token:', error);
      clearToken();
      // 失败时也标记为已获取，避免路由守卫无限等待
      useAppStore().hasFetchedMenus = true;
    })
    .finally(() => {
      // 无论成功失败，都结束 loading
      isPreloading.value = false;
    });
}
