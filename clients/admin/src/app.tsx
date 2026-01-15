import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { RuntimeConfig } from 'umi';
import pkg from '../package.json';
import { ThemeProvider } from './theme';

dayjs.locale('zh-cn');
console.log('version:', pkg.version);

export const rootContainer: RuntimeConfig['rootContainer'] = (container) => {
  return React.createElement(ThemeProvider, null, container);
};
