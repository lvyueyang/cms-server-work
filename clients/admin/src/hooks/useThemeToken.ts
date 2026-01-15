import { theme } from 'antd';

const { useToken } = theme;

export function useThemeToken() {
  const { token } = useToken();
  return token;
}
