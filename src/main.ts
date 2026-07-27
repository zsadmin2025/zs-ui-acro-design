import { createApp } from 'vue';
import ArcoVue, { Message } from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import { setCssVariables } from '@/config/css-variables';
import print from 'vue3-print-nb';
import formCreate from '@form-create/arco-design';
import FcDesigner from '@form-create/antd-designer';
import antd from 'ant-design-vue';
import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';
import { getTenantId } from '@/utils/auth';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/api/interceptor';
import { preload } from './preload';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
setCssVariables();
app.use(ArcoVue, {});
app.use(formCreate);
app.use(ArcoVueIcon);
app.use(VueDOMPurifyHTML);
app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(print);

app.use(antd);
app.use(FcDesigner);
app.use(FcDesigner.formCreate);

// eslint-disable-next-line no-underscore-dangle
Message._context = app._context;

if (getTenantId()) {
  websiteStore().init();
}

// 预加载关键数据（在 Vue 挂载后并行加载，不影响首屏渲染）
preload();

app.mount('#app');
