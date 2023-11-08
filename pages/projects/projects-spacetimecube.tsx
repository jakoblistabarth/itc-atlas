import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { group, max, min, rollup, scaleTime } from "d3";
import type { GetStaticProps, NextPage } from "next";
import { useMemo, useState } from "react";
import { HiCursorClick } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import Button from "../../components/Button";
import Callout from "../../components/Callout/Callout";
import CanvasStage from "../../components/CanvasStage";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import Section from "../../components/Section";
import SelectedProjectsDetails from "../../components/SelectedProjectDetails/SelectedProjectsDetails";
import SpaceTimeCube from "../../components/SpaceTimeCube/SpaceTimeCube";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getProjectsWithCountries, {
  ProjectsWithCountries,
} from "../../lib/data/queries/project/getProjectsWithCountries";
import { SharedPageProps } from "../../types/Props";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import { hasDate } from "../../lib/helpers/hasDate";

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

type selectedCountry = {
  id: string;
  label: string;
};

const ProjectSpaceTimeCube: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<selectedCountry[]>(
    [],
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  );

  const { events, projectsByYearCountry } = useMemo(() => {
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
    return { events, projectsByYearCountry };
  }, [projects]);

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
                className="w-[350px]"
                type="range"
                list="tickmarks"
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
              <datalist id="tickmarks" className="flex justify-between text-xs">
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

          <div className="mt-5 grid">
            <div className="[grid-area:1/1]">
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
                    selectedFeatures={selectedCountries}
                    selectedYear={selectedYear}
                    onPointerDownHandler={(feature: selectedCountry) =>
                      setSelectedCountries((previousState) => {
                        if (
                          previousState.map((d) => d.id).includes(feature.id)
                        ) {
                          return [
                            ...previousState.filter((d) => d.id !== feature.id),
                          ];
                        } else {
                          return [...previousState, feature];
                        }
                      })
                    }
                  />
                  <Environment preset="apartment" />
                  <directionalLight position={[10, 15, 0]} intensity={4} />
                  <directionalLight
                    position={[10, 15, 0]}
                    castShadow
                    shadow-bias={-0.0001}
                  />
                  <AccumulativeShadows
                    resolution={2 ** 12}
                    scale={30}
                    opacity={0.1}
                  >
                    <RandomizedLight position={[10, 15, 0]} />
                  </AccumulativeShadows>
                </Canvas>
              </CanvasStage>
            </div>
            <div className="z-50 mr-4 mt-4 justify-self-end [grid-area:1/1]">
              <SelectedProjectsDetails
                selectedCountries={selectedCountries}
                projectsByYearCountry={projectsByYearCountry}
                projects={projects}
                setSelectedCountries={setSelectedCountries}
              />
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
