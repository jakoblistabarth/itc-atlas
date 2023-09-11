import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";

import { theme } from "../styles/theme";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/inter/slnt.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SWRConfig
    value={{
      fetcher: (resource: RequestInfo | URL) =>
        fetch(resource).then((res) => res.json()),
    }}
  >
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </SWRConfig>
);

export default MyApp;
