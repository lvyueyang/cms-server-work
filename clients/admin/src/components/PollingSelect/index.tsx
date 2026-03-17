import { Select, Tooltip } from 'antd';
import type { SelectProps } from 'antd';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const pollingList = [5, 10, 15, 20, 25, 30, 40, 50, 60];

export default function PollingSelect(
  props: Pick<SelectProps, 'className' | 'style' | 'value' | 'onChange'>,
) {
  const navigate = useNavigate();
  const search = useRouterState({
    select: (state) => state.location.search as Record<string, string | undefined>,
  });

  const polling = search?.polling;

  return (
    <Tooltip title="设置轮询间隔" placement="left">
      <Select
        style={{ minWidth: 70 }}
        {...props}
        defaultValue={polling ? Number(polling) : 10}
        onChange={(e) => {
          console.log('e: ', e);
          navigate({
            search: (prev: any) => ({
              ...(prev as Record<string, string | undefined>),
              polling: String(e),
            }),
            replace: true,
          } as any);
          location.reload();
        }}
      >
        {pollingList.map((item) => {
          return (
            <Select.Option key={item} value={item}>
              {item} s
            </Select.Option>
          );
        })}
      </Select>
    </Tooltip>
  );
}

export function usePollingInterval() {
  const polling = useRouterState({
    select: (state) => (state.location.search as Record<string, string | undefined>)?.polling,
  });
  if (polling) {
    return Number(polling) * 1000;
  }
  return 10 * 1000;
}
