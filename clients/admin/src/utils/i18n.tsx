import { ProColumnType } from '@ant-design/pro-components';
import { Flex, Image, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { ReactNode } from 'react';
import { Translation } from '@/components/TranslationDrawer';
import { ContentType } from '@/constants';

interface Options {
  transType?: ContentType;
  hideValue?: boolean;
}

// 表格添加国际化支持
export function createI18nColumn<T extends Record<string, any> & { id: number | string }>(entity: string) {
  const fn = function i18nColumn(column: ProColumnType<T> & Options) {
    return {
      ...column,
      render: createTableI18nRender<T>(entity, column),
    };
  };
  fn.meta = {
    entity,
  };
  fn.getMeta = (row: T, schema: ProColumnType<T> & Options) => {
    return {
      entity,
      entityId: row.id,
      field: schema.dataIndex as string,
      originValue: row[schema.dataIndex as string],
    } as const;
  };
  fn.I18nBlock = ({
    row,
    dataIndex,
    val,
    transType,
    hideValue,
  }: {
    row: T;
    dataIndex: string;
    val: T[T['dataIndex']];
    transType?: ContentType;
    hideValue?: boolean;
  }) => {
    return (
      <I18nBlock
        entity={entity}
        entityId={row.id}
        field={dataIndex}
        originValue={val}
        type={transType}
        hideValue={hideValue}
      ></I18nBlock>
    );
  };
  return fn;
}

function createTableI18nRender<T extends Record<string, any> & { id: number | string }>(
  entity: string,
  column: ProColumnType<T> & Options,
) {
  return (_: T[T['dataIndex']], row: T) => {
    const dataIndex = column.dataIndex as string;
    const val = row[dataIndex];
    let showValue = val || '-';
    if (column?.hideValue === undefined && column?.transType === 'rich') {
      showValue = '';
    } else {
      showValue = column?.hideValue ? '' : showValue;
    }
    return (
      <I18nBlock
        entity={entity}
        entityId={row.id}
        field={dataIndex}
        originValue={val}
        type={column?.transType}
        hideValue={column?.hideValue}
      >
        {column.ellipsis && val ? (
          <Tooltip
            title={val}
            placement={(column.align as TooltipPlacement) || 'topLeft'}
          >
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {showValue}
            </div>
          </Tooltip>
        ) : column.transType === 'image' ? (
          <Image
            src={val}
            alt={val}
            style={{ width: 30, height: 30 }}
            preview
          />
        ) : (
          showValue
        )}
      </I18nBlock>
    );
  };
}

interface I18nBlockProps {
  entity: string;
  entityId: number | string;
  field: string;
  originValue: string;
  type?: ContentType;
  children?: ReactNode;
  hideValue?: boolean;
}
export function I18nBlock({ entity, entityId, field, originValue, type, hideValue, children }: I18nBlockProps) {
  return (
    <Flex
      gap={5}
      align="center"
      wrap="wrap"
    >
      <Translation
        entity={entity}
        entityId={entityId}
        field={field}
        originValue={originValue}
        type={type}
      />
      {!hideValue && children}
    </Flex>
  );
}
