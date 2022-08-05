import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <DefaultSeo title="Visit Dan" />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
