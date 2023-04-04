import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from "../components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CotLI Tools</title>
      </Head>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </>
  );
}
