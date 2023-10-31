import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GetStaticProps, NextPage } from "next";
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
import Container from "../../components/Container";
import CanvasStage from "../../components/CanvasStage";
import Section from "../../components/Section";
import STCLineChart from "../../components/SpaceTimeCube/charts/STCLineChart";
import { scaleLinear } from "d3";

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

const ProjectSpaceTimeCube: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  );

  type ProjectWithDate = Omit<ProjectsWithCountries[number], "start"> & {
    start: string;
  };

  const hasDate = (
    project: ProjectsWithCountries[number] | ProjectWithDate,
  ): project is ProjectWithDate =>
    project.start !== undefined && project.start !== null;

  const projectsSplit = projects
    .filter((d) => hasDate(d))
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
    //@ts-expect-error needs to be fixed with mapped typing? (too complex for simple predicate)
    new Date(d.start).getFullYear().toString(),
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
  const margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 20,
  };
  const chartHeight = 200;
  const chartWidth = 300;
  const height = 10;
  const timeScale = useMemo(() => {
    const minDate = min(events.map((d) => d.dateStart));
    const maxDate = max(events.map((d) => d.dateEnd ?? new Date()));
    return scaleTime<number, number>()
      .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
      .range([0, height])
      .nice();
  }, [events, height]);

  const years = Array.from(new Array(2026).keys()).slice(1985);

  const xScale = scaleLinear<number, number>()
    .domain([1985, 2025])
    .range([margin.left, chartWidth - margin.right]);
  const yScale = scaleLinear<number, number>()
    .domain([0, 40])
    .range([chartHeight - margin.bottom, margin.top]);
  console.log(yScale.domain(), yScale.range());
  const linePathData = selectedCountries.map((d) => {
    return projectsByYearCountry
      .filter((d1) => d1.countries.has(d))
      .map((d2) => {
        return {
          country: d,
          x: parseInt(d2.year),
          y: d2.countries.get(d) ?? 0,
        };
      })
      .sort((a, b) => b.x - a.x);
  });
  console.log(linePathData);
  return (
    <PageBase title="Projects Space Time Cube">
      <Container>
        <Section>
          <Callout Icon={HiCursorClick}>
            Select individual countries to only see projects related to them.
            Select certain year in the box to see all projects for this year.
          </Callout>
          <div className="flex gap-3">
            <div>
              <input
                id="slider"
                type="range"
                list="tickmarks"
                style={{ width: "500px" }}
                name="year"
                min="0"
                max="40"
                step="1"
                defaultValue="0"
                onChange={(e) => {
                  const yearIndex = parseInt(e.target.value, 10);
                  setSelectedYear(years[yearIndex] + "");
                }}
              />
              <datalist id="tickmarks" className="flex justify-between">
                <option value="0" label="1985" />
                <option value="5" label="1990" />
                <option value="10" label="1995" />
                <option value="15" label="2000" />
                <option value="20" label="2005" />
                <option value="25" label="2010" />
                <option value="30" label="2015" />
                <option value="35" label="2020" />
                <option value="40" label="2025" />
              </datalist>
            </div>
            <Button onClick={() => setSelectedYear(undefined)}>
              <HiXMark />
            </Button>
          </div>

          {selectedCountries.length > 0 && (
            <div className="mt-5">
              <Button onClick={() => setSelectedCountries([])}>
                <HiXMark className="mr-2 inline" />
                Clear country selection
              </Button>
            </div>
          )}
          <div className="relative">
            <CanvasStage height={700}>
              <Canvas
                className="bg-white"
                orthographic
                camera={{ position: [10, 10, 10], zoom: 50, near: 0 }}
                shadows
              >
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  target-y={height / 2}
                  maxPolarAngle={Math.PI / 2}
                  minZoom={30}
                  maxZoom={200}
                />
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
                        return [
                          ...previousState.filter((d) => d !== featureId),
                        ];
                      } else {
                        return [...previousState, featureId];
                      }
                    })
                  }
                />
                <Environment preset="apartment" />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={5}
                  castShadow
                  shadow-bias={-0.0001}
                />
                <AccumulativeShadows
                  resolution={2 ** 12}
                  scale={30}
                  position-y={-0.1}
                  opacity={0.25}
                >
                  <RandomizedLight position={[10, 10, 5]} />
                </AccumulativeShadows>
              </Canvas>
            </CanvasStage>
            {linePathData.length > 0 && (
              <div className="absolute left-5 top-5 rounded-sm bg-white p-3 shadow">
                <p className="text-xs italic">
                  No. of projects of selected countries
                </p>
                <STCLineChart
                  margin={margin}
                  data={linePathData}
                  width={chartWidth}
                  height={chartHeight}
                  xScale={xScale}
                  yScale={yScale}
                  yLabel={"projects"}
                />
              </div>
            )}
            <div className="absolute right-5 top-5 rounded-sm bg-white p-3 shadow">
              <p className="text-xs italic">Details</p>
              {selectedCountries.length > 0 ? (
                selectedCountries.map((isoCode) => (
                  <div key={isoCode}>
                    <h2>{getCountryName(isoCode, neCountriesTopoJson)}</h2>
                    <p>
                      {
                        projects.filter((d) =>
                          d.countries.map((d) => d.isoAlpha3).includes(isoCode),
                        ).length
                      }{" "}
                      Projects
                    </p>
                  </div>
                ))
              ) : (
                <p className="mt-2">Select a country to see details.</p>
              )}
            </div>
          </div>
        </Section>
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

export default ProjectSpaceTimeCube;
