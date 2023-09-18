/** @jsxImportSource theme-ui */

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
import { Box, Card, Heading, Select, Text } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import { useMemo, useState } from "react";
import { group, rollup, max, min, scaleTime } from "d3";
import SpaceTimeCube from "../../components/SpaceTimeCube/SpaceTimeCube";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getProjectsWithCountries, {
  ProjectsWithCountries,
} from "../../lib/data/queries/project/getProjectsWithCountries";
import getCountryName from "../../lib/getCountryName";
import Callout from "../../components/Callout/Callout";
import PageBase from "../../components/PageBase";
import { HiCursorClick } from "react-icons/hi";
import Button from "../../components/Button";
import { HiXMark } from "react-icons/hi2";

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

const ProjectSpaceTimeCube: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );

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
    new Date(d.start ?? "").getFullYear().toString()
  );
  const projectsByYearCountry = Array.from(projectsByYear.entries()).map(
    ([key, projectsPerYear]) => {
      const countries = rollup(
        projectsPerYear,
        (v) => v.length,
        (d) => d.country
      );
      return { year: key, countries };
    }
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
    }
  );

  const height = 10;
  const timeScale = useMemo(() => {
    const minDate = min(events.map((d) => d.dateStart));
    const maxDate = max(events.map((d) => d.dateEnd ?? new Date()));
    return scaleTime<number, number>()
      .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
      .range([height / -2, height / 2])
      .nice();
  }, [events, height]);

  return (
    <PageBase title="Projects Space Time Cube">
      <Box as="section" variant="layout.section">
        <Callout Icon={HiCursorClick}>
          Select individual countries to only see projects related to them.
          Select certain year in the box to see all projects for this year.
        </Callout>
        <Box sx={{ display: "flex", gap: "3" }}>
          <Select
            onChange={(event) => {
              setSelectedYear(event.target.value);
            }}
          >
            {timeScale.ticks(30).map((d) => (
              <option key={d.getTime()}>{d.getFullYear()}</option>
            ))}
          </Select>
          <Button onClick={() => setSelectedYear(undefined)}>
            <HiXMark />
          </Button>
        </Box>

        {selectedCountries.length > 0 && (
          <Button sx={{ mt: 2 }} onClick={() => setSelectedCountries([])}>
            <HiXMark />
            Clear country selection
          </Button>
        )}
        <Box sx={{ width: "100%", height: "600px", position: "relative" }}>
          <Canvas
            style={{ background: "white" }}
            orthographic
            camera={{ position: [0, 0, 100], zoom: 50 }}
            shadows
          >
            <SpaceTimeCube
              topology={neCountriesTopoJson}
              topologyObject="ne_admin_0_countries"
              timeScale={timeScale}
              height={height}
              events={events}
              selectedFeatureIds={selectedCountries}
              selectedYear={selectedYear}
              onPointerDownHandler={(featureId: string) =>
                setSelectedCountries((previousState) => {
                  if (previousState.includes(featureId)) {
                    return [...previousState.filter((d) => d !== featureId)];
                  } else {
                    return [...previousState, featureId];
                  }
                })
              }
            />
            <ambientLight args={["white", 1]} />
            <directionalLight
              position={[10, 12, 0]}
              color="white"
              intensity={2}
            />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
          <Card
            sx={{
              top: 5,
              right: 5,
              position: "absolute",
            }}
          >
            <Text as="p" sx={{ fontStyle: "italic", fontSize: 0 }}>
              Details
            </Text>
            {selectedCountries.length > 0 ? (
              selectedCountries.map((isoCode) => (
                <div key={isoCode}>
                  <Heading as="h2">
                    {getCountryName(isoCode, neCountriesTopoJson)}
                  </Heading>
                  <Text>
                    {
                      projects.filter((d) =>
                        d.countries.map((d) => d.isoAlpha3).includes(isoCode)
                      ).length
                    }{" "}
                    Projects
                  </Text>
                </div>
              ))
            ) : (
              <Text as="p" sx={{ mt: 2 }}>
                Select a country to see details.
              </Text>
            )}
          </Card>
        </Box>
      </Box>
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

export default ProjectSpaceTimeCube;
