import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import PkgConfig from 'vite-plugin-package-config';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const lifecycle = process.env.npm_lifecycle_event;

  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue', 'vue-router'],

        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        dts: 'src/components.d.ts',
        deep: true,
        dirs: ['src/components'],
        extensions: ['vue', 'tsx'],
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
      }),
      PkgConfig(),
      OptimizationPersist(),
      lifecycle === 'report' ? visualizer({ open: true, brotliSize: true, filename: 'report.html' }) : null,
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          rewrite: path => {
            // onsole.log(path); // 打印[/api/userInfo] 这就是http-proxy要请求的url,我们基地址实际是没有/api 所以replace掉
            // return path.replace(/^\/api/, '');
            return path;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
          modifyVars: {
            // hack: `true; @import 'ant-design-vue/dist/antd.variable.less'`,
            // '@primary-color': '#eb2f96', // 全局主色
          },
        },
      },
    },
    optimizeDeps: {
      include: ['@ant-design/icons-vue', 'ant-design-vue'],
    },
  };
});
