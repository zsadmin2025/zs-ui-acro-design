import { createApp } from 'vue';
import ArcoVue, { Message } from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import { setCssVariables } from '@/config/css-variables';
import print from 'vue3-print-nb';

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
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';

const app = createApp(App);
setCssVariables();
app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(VueDOMPurifyHTML);
app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);
app.use(print);

// eslint-disable-next-line no-underscore-dangle
Message._context = app._context;

if (getTenantId()) {
  websiteStore().init();
}

app.mount('#app');
