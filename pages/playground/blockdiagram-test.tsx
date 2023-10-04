/** @jsxImportSource theme-ui */

import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import BlockDiagram from "../../components/BlockDiagram";
import BlockDiagramMarker from "../../components/BlockDiagram/BlockDiagramMarker";
import useSWR from "swr";
import PageBase from "../../components/PageBase";
import { Box, Heading, Text } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import BlockDiagramEnvironment from "../../components/BlockDiagram/BlockDiagramEnvironment";

type Props = SharedPageProps;

const Page: NextPage<Props> = () => {
  const side = 1;
  const aut = useSWR("/api/data/elevationModel/Grossglockner");

  return (
    <PageBase title="Block diagram test">
      <Heading as="h2" sx={{ mt: 5 }}>
        Großglockner
      </Heading>
      <Text>Austria</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas shadows>
          {aut.data && (
            <>
              <BlockDiagram
                textureFileName="grossglockner.png"
                side={side}
                ratio={aut.data.dimensions.ratio}
                yScale={0.00005}
                zOffset={0.1}
                data={Float32Array.from(aut.data.elevation)}
              />
              {[
                [46.99, 13.01],
                [47.09, 12.8],
                [47.0736888633103, 12.6946860503528],
              ].map(([lat, lng]) => (
                <BlockDiagramMarker
                  key={`${lng}-${lat}`}
                  textureFileName="aus.jpg"
                  longitude={lng}
                  latitude={lat}
                  yScale={0.00005}
                  zOffset={0.1}
                  side={side}
                  ratio={aut.data.dimensions.ratio}
                  bBox={aut.data.bBox}
                />
              ))}
            </>
          )}
          <BlockDiagramEnvironment />
        </Canvas>
      </Box>
    </PageBase>
  );
};
export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [countries, neCountriesTopoJson] = await Promise.all([
    getCountryCodes(),
    getCountries(),
  ]);

  return {
    props: {
      neCountriesTopoJson,
      countries,
    },
  };
};
