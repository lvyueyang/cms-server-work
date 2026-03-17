import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import pkg from '../package.json';
import { ThemeProvider } from './theme';

dayjs.locale('zh-cn');
console.log('version:', pkg.version);

export function AppProviders({ children }: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
