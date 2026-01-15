import { ParamsType, ProTable, ProTableProps } from '@ant-design/pro-components';
import { cls } from '@/utils';
import styles from './index.module.less';

function PageTable<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType = 'text'>(
  props: ProTableProps<DataType, Params, ValueType>
) {
  return (
    <ProTable<DataType, Params, ValueType>
      search={false}
      bordered
      cardBordered
      rowKey="id"
      className={cls(props.className, styles.tablePageContainer)}
      {...props}
      scroll={{ y: window.innerHeight - 215, ...props.scroll }}
    />
  );
}

export default PageTable;
