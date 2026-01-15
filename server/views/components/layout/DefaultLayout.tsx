import { SSRContext } from '../../hooks';
import { SSRProps } from '../../types';

// 默认布局组件
export function DefaultLayout({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function ConfigProvider({ children, ...props }: SSRProps<{ children?: React.ReactNode }>) {
  return <SSRContext.Provider value={props}>{children}</SSRContext.Provider>;
}
