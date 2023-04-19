import React from 'react';
import styles from './index.module.less';
import SideBar from '../SideBar';

interface IProps {
  children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
  return (
    <div className={styles.mainLayout}>
      <SideBar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
