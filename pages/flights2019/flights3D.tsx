import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as d3 from "d3";
import { nanoid } from "nanoid";
import type { NextPage } from "next";
import Head from "next/head";
import Heading, { Headings } from "../../components/Heading";
import Flow3D from "../../components/map-3d/Flow3D";
import Globe from "../../components/map-3d/Globe";
import getFlights2019 from "../../lib/data/getFlights2019";
import styles from "../../styles/home.module.css";
import type { ODMatrix } from "../../types/ODMatrix";

type Props = {
  odMatrix: ODMatrix;
};

const earthRadius = 1;

const Flights: NextPage<Props> = ({ odMatrix }) => {
  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scaleWidth = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 100])
    .range([0, 100]);

  return (
    <>
      <Head>
        <title>Flights</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC&apos;s travel activity</Heading>
        <div style={{ width: "100%", height: "700px" }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
            <Globe radius={earthRadius} texture={"explorer"}>
              {odMatrix.flows.features.map((flow) => {
                const origin = flow.geometry.coordinates[0];
                const destination = flow.geometry.coordinates[1];
                return (
                  <Flow3D
                    key={nanoid()}
                    origin={origin}
                    destination={destination}
                    value={scaleWidth(flow.properties?.value)}
                    data={flow.properties}
                  />
                );
              })}
            </Globe>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const flights = await getFlights2019();
  return {
    props: {
      odMatrix: flights.odMatrix,
    },
  };
}

export default Flights;
