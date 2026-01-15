import { ReactNode, useState } from 'react';
import { Button } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { TranslationDrawer, TranslationDrawerProps } from './TranslationDrawer';

const defaultChildren = (
  <Button size="small">
    <TranslationOutlined></TranslationOutlined>
  </Button>
);

export type TranslationProps = Pick<
  TranslationDrawerProps,
  'entity' | 'entityId' | 'field' | 'originValue' | 'type'
> & { children?: ReactNode };
export function Translation({
  entity,
  entityId,
  field,
  originValue,
  type,
  children = defaultChildren,
}: TranslationProps) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setShow(true);
          setOpen(true);
        }}
      >
        {children}
      </div>
      {show && (
        <TranslationDrawer
          open={open}
          onClose={() => setOpen(false)}
          title={`翻译：${entity}#${entityId} · ${field}`}
          entity={entity}
          entityId={entityId}
          field={field}
          originValue={originValue}
          type={type}
          afterOpenChange={(open) => {
            if (!open) {
              setShow(false);
            }
          }}
        />
      )}
    </>
  );
}
