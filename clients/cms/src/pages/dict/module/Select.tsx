import { Button, Divider, Empty, RefSelectProps, Select, SelectProps, Space } from 'antd';
import { forwardRef, useEffect } from 'react';
import { useDictStore } from '@/store/dict';
import { Link } from 'umi';

type DictSelectProps = SelectProps & { type: string };
export const DictSelect = forwardRef<RefSelectProps, DictSelectProps>((props, ref) => {
  const dictStore = useDictStore();
  useEffect(() => {
    dictStore.init();
  }, []);
  const currentType = dictStore.list?.find((o) => o.type === props.type);
  const list = currentType?.values.map((d) => {
    return {
      label: (
        <>
          <span>{d.label}</span>
        </>
      ),
      value: d.value,
    };
  });
  return (
    <Select
      {...props}
      placeholder={currentType ? props.placeholder : `字典缺失，请先添加 [${props.type}]`}
      ref={ref}
      options={list}
      loading={dictStore.loading}
      popupRender={(menu) => {
        if (!currentType)
          return (
            <Empty
              description={
                <>
                  <span>字典缺失，请先 </span>
                  <Link to="/dict" state={{ type: props.type }}>
                    <Button type="primary" size="small">
                      添加
                    </Button>
                  </Link>
                  <br />
                  <br />
                </>
              }
            ></Empty>
          );
        return (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
              <div>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    dictStore.load();
                  }}
                >
                  刷新
                </Button>
              </div>
              <Space>
                <Link to={`/dict/${currentType.id}`} state={{ add: true, type: currentType.id }}>
                  <Button size="small" type="link">
                    添加
                  </Button>
                </Link>
              </Space>
            </div>
          </>
        );
      }}
    />
  );
});
