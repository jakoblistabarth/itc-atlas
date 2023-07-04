/** @jsxImportSource theme-ui */

import { OrbitControls } from "@react-three/drei";
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

type Props = SharedPageProps;

const ShaderTest: NextPage<Props> = () => {
  const side = 3;
  const sur = useSWR("/api/data/elevationModel/Paramaribo");
  const aut = useSWR("/api/data/elevationModel/Grossglockner");
  const swe = useSWR("/api/data/elevationModel/Stockholm");
  const mal = useSWR("/api/data/elevationModel/Malta");

  return (
    <BasePage title="Shader Test">
      <Heading as="h2" sx={{ mt: 5 }}>
        Großglockner
      </Heading>
      <Text>Austria</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {aut.data && (
            <>
              <BlockDiagram
                name="grossglockner"
                side={side}
                ratio={aut.data.dimensions.ratio}
                yScale={0.0001}
                zOffset={0.25}
                segments={
                  Math.sqrt(Float32Array.from(aut.data.elevation).length) - 1
                }
                data={Float32Array.from(aut.data.elevation)}
              />
              {[
                [46.99, 13.01],
                [47.09, 12.8],
                [47.0736888633103, 12.6946860503528],
              ].map(([lat, lng]) => (
                <BlockDiagramMarker
                  key={`${lng}-${lat}`}
                  name="aus"
                  longitude={lng}
                  latitude={lat}
                  yScale={0.0001}
                  zOffset={0.25}
                  side={side}
                  ratio={aut.data.dimensions.ratio}
                  bBox={aut.data.bBox}
                />
              ))}
            </>
          )}
          <OrbitControls />
        </Canvas>
      </Box>

      <Heading as="h2">Paramaribo</Heading>
      <Text>Suriname</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {sur.data && (
            <>
              <BlockDiagram
                name="paramaribo"
                side={side}
                ratio={sur.data.dimensions.ratio}
                yScale={0.01}
                zOffset={0.1}
                segments={Math.sqrt(sur.data.elevation.length) - 1}
                data={Float32Array.from(sur.data.elevation)}
              />
              {[
                [5.9060496147290396, -55.15637217935413],
                [5.81321656500119, -55.158897210508265],
                [5.868621179099353, -55.09840944390688],
              ].map(([lat, lng]) => (
                <BlockDiagramMarker
                  key={`${lat}-${lng}`}
                  name="sur"
                  latitude={lat}
                  longitude={lng}
                  yScale={0.01}
                  zOffset={0.1}
                  side={side}
                  ratio={sur.data.dimensions.ratio}
                  bBox={sur.data.bBox}
                />
              ))}
            </>
          )}
          <pointLight position={[10, 10, 0]} castShadow />
          <OrbitControls enablePan />
        </Canvas>
      </Box>

      <Heading as="h2" sx={{ mt: 5 }}>
        Malta
      </Heading>
      <Text>Malta</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {mal.data && (
            <BlockDiagram
              name="malta"
              side={side}
              ratio={mal.data.dimensions.ratio}
              yScale={0.001}
              zOffset={0.1}
              segments={
                Math.sqrt(Float32Array.from(mal.data.elevation).length) - 1
              }
              data={Float32Array.from(mal.data.elevation)}
            />
          )}
          <OrbitControls />
        </Canvas>
      </Box>

      <Heading as="h2" sx={{ mt: 5 }}>
        Stockholm
      </Heading>
      <Text>Sweden</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {swe.data && (
            <BlockDiagram
              name="stockholm"
              side={side}
              ratio={swe.data.dimensions.ratio}
              yScale={0.0002}
              zOffset={0.25}
              segments={
                Math.sqrt(Float32Array.from(swe.data.elevation).length) - 1
              }
              data={Float32Array.from(swe.data.elevation)}
            />
          )}
          <OrbitControls />
        </Canvas>
      </Box>
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
