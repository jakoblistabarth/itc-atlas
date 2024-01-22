import getBlockdiagramAreas from "../../../lib/data/getBlockdiagramAreas";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { BlockDiagramArea } from "../../../types/BlockdiagramArea";
import useSWRImmutable from "swr/immutable";
import Section from "../../../components/Section";
import getCountries from "../../../lib/data/getCountries";
import { SharedPageProps } from "../../../types/Props";
import getCountryCodes from "../../../lib/data/queries/country/getCountryCodes";
import BlockDiagramAreas from "../../../components/BlockDiagramAreas";
import PageBase from "../../../components/PageBase";
import Container from "../../../components/Container";

const Page = ({
  blockDiagramAreas,
  areaName,
  neCountriesTopoJson,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  //   const data = useSWRImmutable(`/api/data/elevationModel/${areaName}`);

  return (
    <PageBase title={`BlockDiagram ${areaName}`}>
      <Container>
        <h1>{areaName}</h1>
        {blockDiagramAreas.map(({ name }) => name).join(" ")}
        <Section>
          <h2 className="mb-5">Overview block diagram areas</h2>
          <BlockDiagramAreas
            neCountriesTopoJson={neCountriesTopoJson}
            blockDiagramAreas={blockDiagramAreas}
          />
        </Section>
      </Container>
    </PageBase>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<Params> = (async () => {
  const blockDiagramAreas = await getBlockdiagramAreas();
  const paths = blockDiagramAreas.map(({ name }) => ({
    params: {
      name,
    },
  }));
  return { paths, fallback: false };
}) satisfies GetStaticPaths;

interface Params extends ParsedUrlQuery {
  name: string;
}

export const getStaticProps = (async (context) => {
  //@ts-expect-error: wrong typing of parsedqueryurl context
  const { name } = context.params;
  const [blockDiagramAreas, neCountriesTopoJson, countries] = await Promise.all(
    [getBlockdiagramAreas(), getCountries(), getCountryCodes()],
  );
  return {
    props: {
      areaName: name,
      blockDiagramAreas,
      neCountriesTopoJson,
      countries,
    },
  };
}) satisfies GetStaticProps<
  { blockDiagramAreas: BlockDiagramArea[] } & SharedPageProps
>;
