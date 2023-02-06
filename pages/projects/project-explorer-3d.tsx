import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import Point3D from "../../components/map-3d/Point3D";
import getCountries from "../../lib/data/getCountries";
import styles from "../../styles/home.module.css";
import { SharedPageProps } from "../../types/Props";
import * as topojson from "topojson-client";
import { geoCentroid } from "d3-geo";
import React, { useRef } from "react";
import { scaleLinear } from "d3";
import Globe from "../../components/map-3d/Globe";
import lonLatToXYZ from "../../lib/cartographic/lonLatToXYZ";
import GlobeTexture from "../../components/map-3d/GlobeTexture";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";

type Props = SharedPageProps;

const ProjectExplorer3D: NextPage<Props> = ({ neCountriesTopoJson }) => {
  const earthRadius = 1;
  const world = topojson.feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <Head>
        <title>Projects Explorer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Projects Explorer</Heading>
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
            <Globe radius={earthRadius} texture={"explorer"}>
              {world.features.map((country, i) => {
                const centroid = geoCentroid(country);
                const radius = scaleLinear()
                  .domain([0, 1])
                  .range([0.005, 0.03])(Math.random());
                const pos = lonLatToXYZ(
                  centroid[0],
                  centroid[1],
                  earthRadius,
                  radius
                );
                return (
                  <Point3D
                    key={i}
                    pos={pos}
                    radius={radius}
                    data={country.properties}
                  />
                );
              })}
            </Globe>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
          <GlobeTexture
            neCountriesTopoJson={neCountriesTopoJson}
            ref={canvasRef}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();

  return {
    props: {
      countries,
      neCountriesTopoJson,
    },
  };
};

export default ProjectExplorer3D;
