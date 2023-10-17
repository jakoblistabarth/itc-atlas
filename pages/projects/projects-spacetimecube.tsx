import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import React from "react";
import { group, rollup } from "d3";
import SpaceTimeCube from "../../components/SpaceTimeCube/SpaceTimeCube";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getProjectsWithCountries, {
  ProjectsWithCountries,
} from "../../lib/data/queries/project/getProjectsWithCountries";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import CanvasStage from "../../components/CanvasStage";

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

const ProjectExplorer3D: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
}) => {
  const projectsSplit = projects
    .map((p) => {
      const countries = p.countries.map((d) => d.isoAlpha3);
      return countries.flatMap((c) => [
        {
          ...p,
          country: c,
        },
      ]);
    })
    .flat();

  const projectsByYear = group(projectsSplit, (d) =>
    new Date(d.start ?? "").getFullYear().toString(),
  );
  const projectsByYearCountry = Array.from(projectsByYear.entries()).map(
    ([key, projectsPerYear]) => {
      const countries = rollup(
        projectsPerYear,
        (v) => v.length,
        (d) => d.country,
      );
      return { year: key, countries };
    },
  );

  const events: SpaceTimeCubeEvent[] = projectsByYearCountry.flatMap(
    ({ year, countries }) => {
      const countryList = Array.from(countries.entries());
      return countryList.flatMap(([name, size]) => {
        const coordinates = getCentroidByIsoCode(name);
        return coordinates
          ? [
              {
                name,
                dateStart: new Date(year.toString()),
                coordinates,
                size,
              },
            ]
          : [];
      });
    },
  );

  return (
    <PageBase title="Projects Space Time Cube">
      <Container>
        <main>
          <CanvasStage>
            <Canvas
              style={{ background: "white" }}
              orthographic
              camera={{ position: [0, 0, 100], zoom: 50 }}
              shadows
            >
              <SpaceTimeCube
                topology={neCountriesTopoJson}
                topologyObject="ne_admin_0_countries"
                events={events}
              />
              <ambientLight args={[undefined, 0.1]} />
              <hemisphereLight
                color="#ffffff"
                groundColor="#080820"
                intensity={1.0}
              />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </CanvasStage>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [projects, countries, neCountriesTopoJson] = await Promise.all([
    getProjectsWithCountries(),
    getCountryCodes(),
    getCountries(),
  ]);

  return {
    props: {
      neCountriesTopoJson,
      projects,
      countries,
    },
  };
};

export default ProjectExplorer3D;
