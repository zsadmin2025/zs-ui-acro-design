import { defineStore } from 'pinia';
import { sysConfigApi } from '@/api/sys/config';

export const websiteStore = defineStore('website', {
  state: () => ({
    formRef: null,
    website: {
      websiteName: 'My Website',
      description: 'This is my website',
      logo: '/logo.png',
      favicon: '/favicon.ico', // 网站图标，可选url图片
      version: 'v1.0.0',
      copyright: '© 2023 My Website',
      // 备案号
      icp: '京ICP备00000000号',
      // 备案号链接
      icpLink: 'https://beian.miit.gov.cn/',
      // 隐私政策
      privacyPolicy: 'https://example.com/privacy-policy',
      // 服务条款
      termsOfService: 'https://example.com/terms-of-service',
    },
  }),
  getters: {
    rules() {
      return {
        websiteName: [
          { required: true, message: '请输入网站名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入网站描述', trigger: 'blur' },
        ],
        logo: [{ required: true, message: '请上传网站logo', trigger: 'blur' }],
      };
    },
  },
  actions: {
    setWebsite(website: any) {
      this.website = website;
    },
    async init() {
      const data = await sysConfigApi.getWebsiteInfo();
      Object.assign(this.website, data?.data);

      // 设置页面标题
      this.setTitle(this.website.websiteName);
      // 设置favicon
      this.setFavicon(this.website.favicon);
    },
    async save() {
      const dataForm = {
        configKey: 'sys_config_website',
        configValue: JSON.stringify(this.website),
      };
      await sysConfigApi.edit(dataForm);

      // 设置页面标题
      this.setTitle(this.website.websiteName);
      // 设置favicon
      this.setFavicon(this.website.favicon);
    },

    // 更新页面标题
    setTitle(newTitle: string) {
      this.website.websiteName = newTitle;
      document.title = newTitle;
    },
    // 更新favicon
    setFavicon(newFavicon: string) {
      this.website.favicon = newFavicon;
      const link =
        document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]') ||
        document.createElement('link');

      // 监听图片加载失败事件
      const testImg = new Image();
      testImg.src = newFavicon;
      testImg.onerror = () => {
        link.href = '/favicon.ico'; // 本地备用图标
      };

      link.rel = 'shortcut icon';
      link.type = 'image/x-icon';
      link.href = newFavicon;
      document.head.appendChild(link);
    },
  },
});
