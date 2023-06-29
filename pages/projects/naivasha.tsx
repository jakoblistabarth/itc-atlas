import Wordcloud from "../../components/charts/WordCloud";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import { Container, Heading } from "theme-ui";
import LocatorMap from "../../components/map/LocatorMap";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { SharedPageProps } from "../../types/Props";
import getTextFromFile from "../../lib/data/getTextFromFile";
import HierarchyTree, {
  Hierarchy,
} from "../../components/charts/HierarchyTree";
import { readFileSync } from "fs";

type Props = { words: string; hierarchy: Hierarchy } & SharedPageProps;

const Naivasha: NextPage<Props> = ({
  neCountriesTopoJson,
  words,
  hierarchy,
}) => {
  return (
    <>
      <Head>
        <title>Naivasha Region</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">Naivasha Region</Heading>
          <LocatorMap
            neCountriesTopoJson={neCountriesTopoJson}
            highlight={["KEN"]}
          />
          <Heading as="h2">Theory of Change</Heading>
          <HierarchyTree height={600} hierarchy={hierarchy} />
          <Heading as="h2">Wordcloud</Heading>
          <div id="wordcloud">
            <Wordcloud width={960} height={400} text={words} />
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [hierarchy, neCountriesTopoJson, countries, words] = await Promise.all([
    JSON.parse(readFileSync("./data/static/toc-naivasha.json", "utf-8")),
    getCountries(),
    getCountryCodes(),
    getTextFromFile("./data/static/naivasha-msc-theses-titles.txt"),
  ]);

  return {
    props: {
      hierarchy,
      neCountriesTopoJson,
      countries,
      words,
    },
  };
};

export default Naivasha;
