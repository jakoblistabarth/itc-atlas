import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SWRConfig
    value={{
      fetcher: (resource: RequestInfo | URL) =>
        fetch(resource).then((res) => res.json()),
    }}
  >
    <Component {...pageProps} />
  </SWRConfig>
);

export default MyApp;
