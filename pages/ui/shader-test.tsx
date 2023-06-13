/** @jsxImportSource theme-ui */

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import BlockDiagramm from "../../components/map-3d/BlockDiagram";
import useSWR from "swr";
import BasePage from "../../components/BasePage";
import { Box, Heading, Text } from "theme-ui";

const ShaderTest: NextPage = () => {
  // TODO: get segements and side with custom hook from fetched data?
  const segments = 1000;
  const side = 4;
  const sur = useSWR("/api/data/elevation/Paramaribo");
  const aut = useSWR("/api/data/elevation/Grossglockner");
  return (
    <BasePage title="Shader Test">
      <Heading as="h2">Paramaribo</Heading>
      <Text>Suriname</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {sur.data && (
            <BlockDiagramm
              side={side}
              yScale={0.001}
              zOffset={0.1}
              segments={segments}
              data={Float32Array.from(sur.data.elevation)}
            />
          )}
          <OrbitControls enablePan />
        </Canvas>
      </Box>

      <Heading as="h2" sx={{ mt: 5 }}>
        Großglockner
      </Heading>
      <Text>Austria</Text>
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          {aut.data && (
            <BlockDiagramm
              side={side}
              yScale={0.0002}
              zOffset={0.25}
              segments={segments}
              data={Float32Array.from(aut.data.elevation)}
            />
          )}
          <OrbitControls />
        </Canvas>
      </Box>
    </BasePage>
  );
};
export default ShaderTest;
