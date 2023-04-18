import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";

import { theme } from "../styles/theme";
import "@fontsource/fraunces/variable.css";
import "@fontsource/fraunces/variable-italic.css";
import "@fontsource/inter/variable.css";

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
