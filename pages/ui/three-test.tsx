/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BasePage from "../../components/BasePage";
import { Box } from "theme-ui";

const ThreeTest: NextPage = () => {
  return (
    <BasePage title="Three Line Rendering Test">
      <Box variant="layout.canvasStage" sx={{ height: "500px" }}>
        <Canvas orthographic camera={{ zoom: 100 }}>
          <axesHelper />
          <hemisphereLight
            color="#ffffff"
            groundColor="#080820"
            intensity={1.0}
          />
          <mesh>
            <boxBufferGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <OrbitControls />
        </Canvas>
      </Box>
    </BasePage>
  );
};

export default ThreeTest;
