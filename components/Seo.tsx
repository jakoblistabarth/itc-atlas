/** @jsxImportSource theme-ui */

import { FC } from "react";
import Head from "next/head";
import { itc_green } from "../styles/theme";

type Props = {
  title: string;
  description?: string;
  noIndex?: boolean;
};

const Seo: FC<Props> = ({ description, title, noIndex = false }) => {
  return (
    <Head>
      <title>{(title ?? "") + " · ITC Atlas"}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {noIndex && <meta name="robots" content="noindex" />}
      {description && <meta name="description" content={description} />}
      <meta name="theme-color" content={itc_green} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="ITC" />

      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />

      {/* TODO: Add custom favicons and fallbacks */}
      <link rel="icon" href="/favicon.ico" />

      {/* <link rel="manifest" href="/site.webmanifest" /> */}
    </Head>
  );
};

export default Seo;
