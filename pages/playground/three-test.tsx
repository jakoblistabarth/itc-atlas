import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PageBase from "../../components/PageBase";
import CanvasStage from "../../components/CanvasStage";

const ThreeTest: NextPage = () => {
  return (
    <PageBase title="Three line rendering test">
      <CanvasStage>
        <Canvas orthographic camera={{ zoom: 100 }}>
          <axesHelper />
          <hemisphereLight
            color="#ffffff"
            groundColor="#080820"
            intensity={1.0}
          />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <OrbitControls />
        </Canvas>
      </CanvasStage>
    </PageBase>
  );
};

export default ThreeTest;
