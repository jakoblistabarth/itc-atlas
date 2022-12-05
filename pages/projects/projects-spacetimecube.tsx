import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import getCountries from "../../lib/data/getCountries";
import styles from "../../styles/home.module.css";
import { SharedPageProps } from "../../types/Props";
import React, { useRef } from "react";
import { group, rollup, scaleLinear } from "d3";
import SpaceTimeCube from "../../components/map-3d/SpaceTimeCube";
import { Project } from "../../types/Project";
import getProjects from "../../lib/data/getProjects";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";

type Props = SharedPageProps & {
  projects: Project[];
};

const ProjectExplorer3D: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
}) => {
  const projectsSplit = projects
    .map((p) => {
      const countries = p.allCountries;
      return countries.flatMap((c) => [
        {
          ...p,
          country: c,
        },
      ]);
    })
    .flat();

  const projectsByYear = group(projectsSplit, (d) =>
    new Date(d.dateStart ?? "").getFullYear()
  );
  const projectsByYearCountry = Array.from(projectsByYear.entries()).map(
    ([key, projectsPerYear]) => {
      const countries = rollup(
        projectsPerYear,
        (v) => v.length,
        (d) => d.country
      );
      return [key, countries];
    }
  );

  const events: SpaceTimeCubeEvent[] = projectsByYearCountry
    .flatMap(([year, countries]) => {
      const countryList = Array.from(countries.entries());
      return countryList.map(([code, value]) => ({
        name: code,
        dateStart: new Date(year.toString()),
        coordinates: getCentroidByIsoCode(code),
        size: value,
      }));
    })
    .filter((e) => e.coordinates);

  return (
    <>
      <Head>
        <title>Projects Space Time Cube</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Projects Space Time Cube</Heading>
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas
            style={{ background: "white" }}
            orthographic
            camera={{ position: [0, 0, 100], zoom: 300 }}
            shadows
          >
            <SpaceTimeCube geoData={neCountriesTopoJson} events={events} />
            <ambientLight args={[undefined, 0.1]} />
            <hemisphereLight
              color="#ffffff"
              groundColor="#080820"
              intensity={1.0}
            />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const projects = await getProjects();

  return {
    props: {
      neCountriesTopoJson,
      projects,
    },
  };
};

export default ProjectExplorer3D;