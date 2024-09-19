import React from 'react';
import { NewsController } from '@server/modules/news/news.controller';
import dayjs from 'dayjs';
import { createPage } from '@/lib/ssr';
import Head from 'next/head';
export { getServerSideProps } from '@/lib/ssr';

type PageData = NewsController['detail'];

export default createPage<PageData>(function NewsDetail({ pageData, globalData }) {
  return (
    <>
      <Head>
        <title>{pageData.info.title}</title>
      </Head>
      <div>
        <h1>新闻详情：{pageData.info.title}</h1>
        <hr />
        <div>{pageData.info.desc}</div>
        <div>{pageData.info.author}</div>
        <div>{dayjs(pageData.info?.push_date).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div dangerouslySetInnerHTML={{ __html: pageData.info.content }}></div>
      </div>
    </>
  );
});
