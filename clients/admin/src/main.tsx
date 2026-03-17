import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from './theme';
import './global.scss';
import { router } from './router';

dayjs.locale('zh-cn');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
