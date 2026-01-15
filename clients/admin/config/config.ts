import path from 'node:path';
import { defineConfig } from 'umi';
import workConfig from '../../../work.config.json';
import router from './router';

const targetProxy = 'http://127.0.0.1:7001/';

export default defineConfig({
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: targetProxy,
      changeOrigin: true,
      secure: false,
    },
    '/uploadfile': {
      target: targetProxy,
      changeOrigin: true,
      secure: false,
    },
    '/getfile': {
      target: targetProxy,
      changeOrigin: true,
      secure: false,
    },
  },
  routes: router.routes,
  title: '管理后台',
  base: `/${workConfig.cms_admin_path}`,
  publicPath: `/${workConfig.cms_admin_path}/`,
  outputPath: path.join(__dirname, '../../../server/admin-ui/dist'),
  // targets: {
  //   ie: 11,
  // },
  // codeSplitting: {
  //   jsStrategy: 'granularChunks',
  // },
  esbuildMinifyIIFE: true,
});
