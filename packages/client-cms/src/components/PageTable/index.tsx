import { cls } from '@/utils';
import { ParamsType, ProTable, ProTableProps } from '@ant-design/pro-components';
import styles from './index.module.less';

function PageTable<
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(props: ProTableProps<DataType, Params, ValueType>) {
  return (
    <ProTable<DataType, Params, ValueType>
      search={false}
      bordered
      scroll={{ y: window.innerHeight - 215 }}
      rowKey="id"
      className={cls(props.className, styles.tablePageContainer)}
      {...props}
    />
  );
}

export default PageTable;
