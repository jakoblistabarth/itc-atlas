import {
  Bounds,
  Edges,
  Environment,
  Html,
  OrbitControls,
  Plane,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { randomUniform } from "d3";
import type { NextPage } from "next";
import {
  BoxGeometry,
  BufferAttribute,
  DoubleSide,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import SoftLight from "../../components/SoftLight";
import sliceIntoChunks from "../../lib/utilities/sliceIntoChunks";
import Section from "../../components/Section";
import Callout from "../../components/Callout";

const baseMaterial = new MeshStandardMaterial({
  color: "lightblue",
});

const Page: NextPage = () => {
  return (
    <PageBase title="Geometry displacement">
      <Container>
        <Section>
          <PlaneDisplacement />
        </Section>
        <Section>
          <BoxDisplacement />
        </Section>
      </Container>
    </PageBase>
  );
};
export default Page;

const BoxDisplacement = () => {
  const segments = { x: 4, y: 1, z: 4 };
  const dimensions = { width: 1, height: 0.5, depth: 2 };
  const boxGeometry = new BoxGeometry(
    dimensions.width,
    dimensions.height,
    dimensions.depth,
    segments.x,
    segments.y,
    segments.z,
  );
  const start = (segments.x + 1) * (segments.y + 1) * 2; // 2 times for 2 faces;
  const end = start + (segments.x + 1) * (segments.z + 1);
  const position = boxGeometry.getAttribute("position");

  const positions = sliceIntoChunks(
    Array.from(position.array),
    position.itemSize,
  );
  const displacement = Array.from({ length: position.count })
    .fill(0)
    .map((_, i) => (i > start && i < end ? randomUniform(300)() : 0));
  boxGeometry.setAttribute(
    "displacement",
    new BufferAttribute(Float32Array.from(displacement), 1),
  );
  const normals = sliceIntoChunks(
    Array.from(boxGeometry.getAttribute("normal").array),
    position.itemSize,
  );
  return (
    <div>
      <h2>Box displacement</h2>
      <Callout>
        <h3>Vertex order and position</h3>
        <strong>{position.array.length}</strong> positions in total <br />
        <strong>{position.count}</strong> distinct points
        <br />
        Segements: x: {segments.x} y: {segments.y} z:{segments.z}
        <br />
        start: {start} – end: {end}
      </Callout>
      <CanvasStage className="h-[500px]">
        <Canvas orthographic shadows camera={{ position: [3, 3, 3], near: 0 }}>
          <fog attach={"fog"} args={["white", 10, 20]} />
          <OrbitControls makeDefault />
          <SoftLight position={[5, 5, 10]} />
          <Environment preset="apartment" />
          <group position-y={dimensions.height / 2}>
            <Bounds fit>
              <mesh
                geometry={boxGeometry}
                material={baseMaterial}
                castShadow
                receiveShadow
              >
                <CustomShaderMaterial
                  baseMaterial={baseMaterial}
                  uniforms={{
                    u_zOffset: {
                      value: 0.05,
                    },
                    u_yScale: {
                      value: 0.001,
                    },
                  }}
                />
                <Edges />
              </mesh>
            </Bounds>
            {positions.map((p, i) => (
              <group key={i} position={[...p]}>
                {normals[i].join("") === "010" && (
                  <Html position-y={0.03} center>
                    {i}
                  </Html>
                )}
                <Sphere
                  args={[0.01]}
                  material={new MeshStandardMaterial({ color: "grey" })}
                />
              </group>
            ))}
          </group>
          <Plane
            receiveShadow
            castShadow
            scale={20}
            rotation-x={Math.PI / -2}
            material={baseMaterial}
          />
          <Sphere
            castShadow
            receiveShadow
            scale={0.2}
            position-y={1.2}
            material={baseMaterial}
          ></Sphere>
          <axesHelper />
        </Canvas>
      </CanvasStage>
    </div>
  );
};

const PlaneDisplacement = () => {
  const boxGeometry = new BoxGeometry(1, 1, 1, 5, 1, 5);
  const planeGeometry = new PlaneGeometry(1, 1, 20, 20);
  const planePosition = planeGeometry.getAttribute("position");
  const planePositions = sliceIntoChunks(
    Array.from(planePosition.array),
    planePosition.itemSize,
  );
  const newPositions = planePositions.map(([x, y]) => [
    x,
    y,
    randomUniform(0.25)(),
  ]);
  planeGeometry.setAttribute(
    "position",
    new BufferAttribute(Float32Array.from(newPositions.flat()), 3),
  );
  // planeGeometry.computeVertexNormals();
  planeGeometry.computeTangents();

  return (
    <div>
      <h2>Plane Displacement</h2>
      <CanvasStage className="h-[500px]">
        <Canvas
          orthographic
          shadows
          camera={{ position: [25, 25, 25], near: 0, zoom: 100 }}
        >
          <Plane
            args={[20, 20]}
            material={baseMaterial}
            rotation-x={-Math.PI / 2}
            receiveShadow
          />
          <OrbitControls makeDefault />
          <Environment preset="sunset" />
          <ambientLight intensity={2} />
          <SoftLight position={[10, 10, 5]} />
          <directionalLight position={[-5, 10, -5]} />
          <group position-y={1}>
            <Sphere
              args={[0.6]}
              position-z={2}
              material={baseMaterial}
              castShadow
              receiveShadow
            />

            <mesh
              position-z={-2}
              geometry={boxGeometry}
              material={baseMaterial}
              castShadow
              receiveShadow
            />

            <mesh
              rotation-x={-Math.PI / 2}
              geometry={planeGeometry}
              material={
                new MeshStandardMaterial({
                  color: "lightblue",
                  side: DoubleSide,
                })
              }
              castShadow
              receiveShadow
            />
          </group>
        </Canvas>
      </CanvasStage>
    </div>
  );
};
