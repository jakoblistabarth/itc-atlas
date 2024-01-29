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
import CanvasStage from "../../components/CanvasStage";
import BlockDiagram from "../../components/BlockDiagram";
import useSWRImmutable from "swr/immutable";
import { Canvas } from "@react-three/fiber";
import BlockDiagramEnvironment from "../../components/BlockDiagram/BlockDiagramEnvironment";

type Props = { words: string; hierarchy: Hierarchy } & SharedPageProps;

const Naivasha: NextPage<Props> = ({
  neCountriesTopoJson,
  words,
  hierarchy,
}) => {
  const { data } = useSWRImmutable("/api/data/elevationModel/Naivasha");
  return (
    <PageBase title="Naivasha Region">
      <Container>
        <main>
          <div className="my-10 grid grid-cols-[2fr_1fr] gap-x-5">
            <div>
              <CanvasStage className="h-[300px]">
                <Canvas shadows>
                  {data && (
                    <BlockDiagram
                      side={1}
                      ratio={data.dimensions.ratio}
                      yScale={0.00003}
                      zOffset={0.1}
                      data={Float32Array.from(data.elevation)}
                      bBox={data.bBox}
                    />
                  )}
                  <BlockDiagramEnvironment />
                </Canvas>
              </CanvasStage>
            </div>
            <LocatorMap
              neCountriesTopoJson={neCountriesTopoJson}
              highlight={["KEN"]}
            />
          </div>
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
