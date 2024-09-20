import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/common.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SSR</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
