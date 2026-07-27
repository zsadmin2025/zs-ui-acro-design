import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configImageminPlugin(),
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              // UI 框架
              if (id.includes('@arco-design/web-vue')) return 'arco';
              if (id.includes('ant-design-vue')) return 'antd';
              // 图表
              if (id.includes('echarts') || id.includes('vue-echarts'))
                return 'chart';
              // 核心框架
              if (
                id.includes('vue') ||
                id.includes('vue-router') ||
                id.includes('pinia') ||
                id.includes('@vueuse') ||
                id.includes('vue-i18n')
              )
                return 'vue';
              // 3D 引擎
              if (id.includes('three')) return 'three';
              // 工具库
              if (id.includes('lodash')) return 'lodash';
              // 日历
              if (id.includes('@fullcalendar')) return 'fullcalendar';
              // 表单构建器
              if (id.includes('@form-create')) return 'formCreate';
              // 富文本编辑器
              if (id.includes('@wangeditor')) return 'wangeditor';
              // 其他 node_modules 统一打入 vendor
              return 'vendor';
            }
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig,
);
