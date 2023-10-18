import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { ThemeProvider } from "next-themes";

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
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  </SWRConfig>
);

export default MyApp;
