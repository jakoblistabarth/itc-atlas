/** @jsxImportSource theme-ui */

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import BlockDiagram from "../../components/map-3d/BlockDiagram";
import BlockDiagrammMarker from "../../components/map-3d/BlockDiagramMarker";
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
          <>
            <BlockDiagram
              side={side}
              yScale={0.01}
              zOffset={0.01}
              segments={segments}
              data={Float32Array.from(sur.data.elevation)}
            />
            <BlockDiagrammMarker
                name="Par"
                Latitude={5.85}
                Lontitude={-55.1}
                yScale={0.01}
                zOffset={0.01}
                height={sur.data.elevation}
              />
              <BlockDiagrammMarker
                name="Par"
                Latitude={5.8512}
                Lontitude={-55.157}
                yScale={0.01}
                zOffset={0.01}
                height={sur.data.elevation}
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
              side={side}
              yScale={0.0002}
              zOffset={0.25}
              segments={segments}
              data={Float32Array.from(aut.data.elevation)}
            />
            <BlockDiagrammMarker
                name="aus"
                Latitude={47.0725357}
                Lontitude={12.7909824}
                yScale={0.0002}
                zOffset={0.25}
                height={aut.data.elevation}
              />
              <BlockDiagrammMarker
                name="aus"
                Latitude={46.99}
                Lontitude={13.01}
                yScale={0.0002}
                zOffset={0.25}
                height={aut.data.elevation}
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
