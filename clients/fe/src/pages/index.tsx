import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AVATAR from '../assets/images/avatar.png';

const Home: NextPage = () => {
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
};

export default Home;
