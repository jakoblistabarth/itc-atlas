import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import BlockDiagramm from "../../components/map-3d/BlockDiagram";
import styles from "../../styles/Home.module.css";
import useSWR from "swr";

const ShaderTest: NextPage = () => {
  // TODO: get segements and side with custom hook from fetched data?
  const segments = 400;
  const side = 4;

  const { data, error, isLoading } = useSWR("/api/data/elevation/Paramaribo");

  return (
    <>
      <Head>
        <title>Shader Test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Shader Test</Heading>
        <Canvas
          orthographic
          camera={{ zoom: 70 }}
          style={{ width: "100%", height: "500px" }}
        >
          <axesHelper args={[side * 0.75]} />
          {data && (
            <group position={[0, 0, 0]}>
              <BlockDiagramm
                side={side}
                yScale={0.01}
                zOffset={0.25}
                segments={segments}
                data={Float32Array.from(data.elevation)}
              />
            </group>
          )}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[side, side, segments, segments]} />
            <shaderMaterial />
          </mesh>
          <OrbitControls />
        </Canvas>
      </main>

      <Footer />
    </>
  );
};

export default ShaderTest;
