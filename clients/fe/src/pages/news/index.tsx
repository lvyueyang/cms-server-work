import React from 'react';
import Link from 'next/link';
import { NewsController } from '@server/modules/news/news.controller';
import { SSRProps } from '@/typing';
import { createPage } from '@/lib/ssr';
export { getServerSideProps } from '@/lib/ssr';

type PageData = NewsController['list'];

export default createPage<PageData>(function News(props) {
  return (
    <div>
      <h1>新闻列表</h1>
      <ul>
        {props.pageData.list.map((item) => {
          return (
            <li key={item.id}>
              <Link href={`/news/${item.id}`}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
