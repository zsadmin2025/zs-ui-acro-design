import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

// 👇 路径解析函数
const pathSrc = resolve(__dirname, '../src');
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    configArcoStyleImportPlugin(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(pathSrc, 'assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
    }),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', '@vueuse/core', 'vue-router'],
      dts: resolve(pathSrc, 'typings/auto-imports.d.ts'),
      resolvers: [ArcoResolver()],

      // 👇 自动导入 Vue 模板中的变量（实验性）
      vueTemplate: true,
      // 👇 为 ESLint 提供全局变量支持
      eslintrc: {
        enabled: true,
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      // 👇 加入 Vite 的依赖优化列表（推荐）
      viteOptimizeDeps: true,
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
      deep: true, // 👈 添加此行以支持深层扫描
      // 👇 自动加载 components 文件夹下的组件（可选）
      dirs: [resolve(pathSrc, 'components')],
      // 👇 生成 types 文件（用于 TypeScript 支持）
      dts: resolve(pathSrc, 'typings/components.d.ts'),
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less',
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
