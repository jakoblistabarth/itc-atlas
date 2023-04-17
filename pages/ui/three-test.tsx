import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import { Container, Heading } from "theme-ui";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ThreeTest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Three Line Rendering Test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">Three Line Rendering Test</Heading>
          <Canvas
            orthographic
            camera={{ zoom: 100 }}
            style={{ width: "100%", height: "500px" }}
          >
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
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default ThreeTest;
