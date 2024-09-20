import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AVATAR from '../assets/images/avatar.png';
import { createPage } from '@/lib/ssr';
export { getServerSideProps } from '@/lib/ssr';

export default createPage(function Home() {
  return (
    <div>
      <Image src={AVATAR} alt="" />
      <h1>首页</h1>
      <ul>
        <li>
          <Link href="/news">新闻列表</Link>
        </li>
      </ul>
    </div>
  );
});
