import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

import "../styles/globals.css";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/inter/slnt.css";

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
