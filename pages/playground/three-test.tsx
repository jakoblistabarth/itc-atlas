import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import PageBase from "../../components/PageBase";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";

const ThreeTest: NextPage = () => {
  return (
    <PageBase title="Three line rendering test">
      <Container>
        <CanvasStage>
          <Canvas orthographic camera={{ zoom: 100 }}>
            <axesHelper />
            <Environment preset="apartment" />
            <mesh position-y={5}>
              <boxGeometry args={[1, 10, 1]} />
              <meshStandardMaterial color={"red"} />
            </mesh>
            <OrbitControls target={[0, 5, 0]} />
          </Canvas>
        </CanvasStage>
      </Container>
    </PageBase>
  );
};

export default ThreeTest;
