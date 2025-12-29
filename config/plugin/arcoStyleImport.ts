/**
 * Theme import
 * 样式按需引入
 * https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-vue/README.md
 * https://arco.design/vue/docs/start
 */
import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default function configArcoStyleImportPlugin() {
  const arcoResolverPlugin = vitePluginForArco({
    style: 'css',
    resolveComponents: true, // 默认为 true
  });
  return arcoResolverPlugin;
}
