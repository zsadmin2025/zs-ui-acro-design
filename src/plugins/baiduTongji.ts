// plugins/baiduTongji.js
declare global {
  interface Window {
    _hmt: any[];
  }
}

export default {
  install(app: any, siteId: string) {
    if (!siteId) return;

    // 加载百度统计脚本
    const script = document.createElement('script');
    script.src = `https://hm.baidu.com/hm.js?${siteId}`;
    script.async = true;
    document.head.appendChild(script);

    // 初始化 _hmt
    // eslint-disable-next-line no-underscore-dangle
    window._hmt = window._hmt || [];

    // 监听路由变化（需配合 vue-router）
    const router = app.config.globalProperties.$router;
    if (router) {
      router.afterEach((to: any) => {
        // eslint-disable-next-line no-underscore-dangle
        window._hmt.push(['_trackPageview', to.fullPath]);
      });
    }
  },
};
