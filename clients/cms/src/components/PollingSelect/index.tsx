import { Select, Tooltip } from 'antd';
import { SelectProps } from 'rc-select';
import { useSearchParams } from 'umi';

const pollingList = [5, 10, 15, 20, 25, 30, 40, 50, 60];

export default function PollingSelect(
  props: Pick<SelectProps, 'className' | 'style' | 'value' | 'onChange'>,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const polling = searchParams.get('polling');

  return (
    <Tooltip title="设置轮询间隔" placement="left">
      <Select
        style={{ minWidth: 70 }}
        {...props}
        defaultValue={polling ? Number(polling) : 10}
        onChange={(e) => {
          console.log('e: ', e);
          searchParams.set('polling', e);
          setSearchParams(searchParams, { replace: true });
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
  const [searchParams] = useSearchParams();

  const polling = searchParams.get('polling');
  if (polling) {
    return Number(polling) * 1000;
  }
  return 10 * 1000;
}
