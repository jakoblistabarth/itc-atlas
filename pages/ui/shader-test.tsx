/** @jsxImportSource theme-ui */

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import BlockDiagram from "../../components/map-3d/BlockDiagram";
import BlockDiagramMarker from "../../components/map-3d/BlockDiagramMarker";
import useSWR from "swr";
import BasePage from "../../components/BasePage";
import { Box, Heading, Text } from "theme-ui";

const ShaderTest: NextPage = () => {
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
            <>
              <BlockDiagram
                name="par"
                side={side}
                yScale={0.001}
                zOffset={0.1}
                segments={Math.sqrt(sur.data.elevation.length) - 1}
                data={Float32Array.from(sur.data.elevation)}
              />
              <BlockDiagramMarker
                name="sur"
                latitude={5.920616894}
                longitude={-55.2499057923}
                yScale={0.01}
                gridSize={1001}
                zOffset={0.01}
                height={sur.data.elevation}
                bBox={sur.data.bBox}
              />
              <BlockDiagramMarker
                name="sur"
                latitude={5.8512}
                longitude={-55.157}
                yScale={0.01}
                gridSize={1001}
                zOffset={0.01}
                height={sur.data.elevation}
                bBox={sur.data.bBox}
              />
            </>
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
            <>
              <BlockDiagram
                name="blo"
                side={side}
                yScale={0.0002}
                zOffset={0.25}
                segments={
                  Math.sqrt(Float32Array.from(aut.data.elevation).length) - 1
                }
                data={Float32Array.from(aut.data.elevation)}
              />
              <BlockDiagramMarker
                name="aus"
                latitude={47.0725357}
                longitude={12.7909824}
                yScale={0.0002}
                gridSize={1001}
                zOffset={0.25}
                height={aut.data.elevation}
                bBox={aut.data.bBox}
              />
              <BlockDiagramMarker
                name="aus"
                latitude={46.99}
                longitude={13.01}
                yScale={0.0002}
                gridSize={1001}
                zOffset={0.25}
                height={aut.data.elevation}
                bBox={aut.data.bBox}
              />
            </>
          )}
          <OrbitControls />
        </Canvas>
      </Box>
    </BasePage>
  );
};
export default ShaderTest;
