import React from 'react';
import styles from './index.module.less';

export default function PageContainer({ children }: React.PropsWithChildren) {
  return <div className={styles.pageContainer}>{children}</div>;
}
