import Wordcloud from "../../components/WordCloud";
import type { GetStaticProps, NextPage } from "next";
import LocatorMap from "../../components/LocatorMap";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { SharedPageProps } from "../../types/Props";
import getTextFromFile from "../../lib/data/getTextFromFile";
import HierarchyTree, { Hierarchy } from "../../components/HierarchyTree";
import { readFileSync } from "fs";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";

type Props = { words: string; hierarchy: Hierarchy } & SharedPageProps;

const Naivasha: NextPage<Props> = ({
  neCountriesTopoJson,
  words,
  hierarchy,
}) => {
  return (
    <PageBase title="Naivasha Region">
      <Container>
        <main>
          <LocatorMap
            neCountriesTopoJson={neCountriesTopoJson}
            highlight={["KEN"]}
          />
          <h2>Theory of Change</h2>
          <HierarchyTree height={600} hierarchy={hierarchy} />
          <h2>Wordcloud</h2>
          <div id="wordcloud">
            <Wordcloud width={960} height={400} text={words} />
          </div>
        </main>
      </Container>
    </PageBase>
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
