import React from 'react';
import HeaderBar from './HeaderBar';
import SideBar from './SideBar';
import styles from './index.module.less';

interface IProps {
  children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
  return (
    <div className={styles.mainLayout}>
      <SideBar />
      <div className={styles.contentWrap}>
        <HeaderBar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
