import path from 'path';
import { defineConfig } from 'umi';
import workConfig from '../../../work.config.json';
import router from './router';

export default defineConfig({
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
      secure: false,
    },
    '/uploadfile': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
      secure: false,
    },
  },
  routes: router.routes,
  title: 'XX内容管理系统',
  base: `/${workConfig.cms_admin_path}`,
  publicPath: `/${workConfig.cms_admin_path}/`,
  outputPath: path.join(__dirname, '../../server/admin-ui/dist'),
  // targets: {
  //   ie: 11,
  // },
  // codeSplitting: {
  //   jsStrategy: 'granularChunks',
  // },
});
