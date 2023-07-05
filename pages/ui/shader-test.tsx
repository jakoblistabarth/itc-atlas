/** @jsxImportSource theme-ui */

import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import BlockDiagram from "../../components/map-3d/BlockDiagram";
import BlockDiagramMarker from "../../components/map-3d/BlockDiagramMarker";
import useSWR from "swr";
import BasePage from "../../components/BasePage";
import { Box, Heading, Text } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import BlockDiagramEnvironment from "../../components/map-3d/BlockDiagramEnvironment";

type Props = SharedPageProps;

const ShaderTest: NextPage<Props> = () => {
  const side = 1;
  const sur = useSWR("/api/data/elevationModel/Paramaribo");
  const aut = useSWR("/api/data/elevationModel/Grossglockner");
  const mal = useSWR("/api/data/elevationModel/Malta");

  return (
    <BasePage title="Shader Test">
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

      {/* <Heading as="h2">Paramaribo</Heading>
      <Text>Suriname</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas shadows>
          {sur.data && (
            <>
              <BlockDiagram
                textureFileName="paramaribo.png"
                side={side}
                ratio={sur.data.dimensions.ratio}
                yScale={0.001}
                zOffset={0.1}
                data={Float32Array.from(sur.data.elevation)}
              />
              {[
                [5.9060496147290396, -55.15637217935413],
                [5.81321656500119, -55.158897210508265],
                [5.868621179099353, -55.09840944390688],
              ].map(([lat, lng]) => (
                <BlockDiagramMarker
                  key={`${lat}-${lng}`}
                  textureFileName="sur.jpg"
                  latitude={lat}
                  longitude={lng}
                  yScale={0.001}
                  zOffset={0.1}
                  side={side}
                  ratio={sur.data.dimensions.ratio}
                  bBox={sur.data.bBox}
                />
              ))}
            </>
          )}
          <BlockDiagramEnvironment />
        </Canvas>
      </Box>

      <Heading as="h2" sx={{ mt: 5 }}>
        Malta
      </Heading>
      <Text>Malta</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas shadows>
          {mal.data && (
            <BlockDiagram
              textureFileName="uv-grid.png"
              side={side}
              ratio={mal.data.dimensions.ratio}
              yScale={0.00025}
              zOffset={0.1}
              data={Float32Array.from(mal.data.elevation)}
            />
          )}
          <BlockDiagramEnvironment />
        </Canvas>
      </Box> */}
    </BasePage>
  );
};
export default ShaderTest;

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
