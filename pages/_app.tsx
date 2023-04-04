import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from "../components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CotLI Tools</title>
        <link rel='shortcut icon' href='/cotli-tools/favicon.ico' />
      </Head>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </>
  );
}
