import React from 'react';
import { cls } from '@/utils';

export function Breadcrumb({
  items,
  className,
}: {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}) {
  return (
    <div className={cls('breadcrumb', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div
            key={index}
            className="breadcrumb-item"
          >
            {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          </div>
          {index !== items.length - 1 && <span key={`${index}-slash`}>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
