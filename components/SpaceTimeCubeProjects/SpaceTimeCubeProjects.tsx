import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { max, min, scaleTime } from "d3";
import { FC, Suspense, memo, useCallback, useMemo, useState } from "react";
import { HiCursorClick } from "react-icons/hi";
import Callout from "../../components/Callout/Callout";
import CanvasStage from "../../components/CanvasStage";
import Skeleton from "../../components/Skeleton";
import SpaceTimeCube from "../../components/SpaceTimeCube/SpaceTimeCube";
import { ProjectsWithCountries } from "../../lib/data/queries/project/getProjectsWithCountries";
import { FeatureIdentifier } from "../../types/FeatureIdentifier";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { Card } from "../Card";
import SelectedYearDetails from "../SelectedYearDetails/SelectedYearDetails";
import SoftLight from "../SoftLight";
import TimelineControl from "../TimelineControl";
import Tooltip from "../Tooltip";
import SelectedProjectsDetails from "./SelectedProjectsDetails";
import useProjectEvents from "./useProjectEvents.hooks";

type Props = {
  projects: ProjectsWithCountries;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const SpaceTimeCubeProjects: FC<Props> = ({
  projects,
  neCountriesTopoJson,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<
    FeatureIdentifier[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
  const [hoverInfo, setHoverInfo] = useState<FeatureIdentifier | undefined>(
    undefined,
  );

  const { events, projectsByYearCountry } = useProjectEvents(projects);

  const onPointerEnterHandler = useCallback((feature: FeatureIdentifier) => {
    setHoverInfo(feature);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const onPointerDownHandler = useCallback((feature: FeatureIdentifier) => {
    setSelectedCountries((previousState) => {
      if (previousState.map((d) => d.id).includes(feature.id)) {
        return [...previousState.filter((d) => d.id !== feature.id)];
      } else {
        return [...previousState, feature];
      }
    });
  }, []);

  const height = 10;
  const timeScale = useMemo(() => {
    const minDate = min(events.map((d) => d.dateStart));
    const maxDate = max(events.map((d) => d.dateStart ?? new Date()));
    return scaleTime<number, number>()
      .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
      .range([0, height])
      .nice();
  }, [events, height]);

  return (
    <>
      <Callout Icon={HiCursorClick}>
        Select individual countries to only see projects related to them. Select
        certain year in the box to see all projects for this year.
      </Callout>

      <div className="mt-5 grid">
        <div className="[grid-area:1/1]">
          <Suspense fallback={<Skeleton className="h-[700px]" />}>
            <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
              <Tooltip.Trigger asChild>
                <CanvasStage className="h-[700px]">
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
                    <MemoizedSpaceTimeCube
                      topology={neCountriesTopoJson}
                      topologyObject="ne_admin_0_countries"
                      timeScale={timeScale}
                      height={height}
                      events={events}
                      selectedFeatures={selectedCountries}
                      selectedYear={selectedYear}
                      onPointerEnterHandler={onPointerEnterHandler}
                      onPointerLeaveHandler={onPointerLeaveHandler}
                      onPointerDownHandler={onPointerDownHandler}
                    />
                    <Environment preset="apartment" />
                    <directionalLight
                      position={[10, 10, 5]}
                      intensity={5}
                      castShadow
                      shadow-bias={-0.0001}
                    />
                    <AccumulativeShadows
                      frames={0}
                      opacity={0.1}
                      resolution={2 ** 12}
                      scale={30}
                    >
                      <SoftLight position={[10, 10, 0]} radius={2} />
                    </AccumulativeShadows>
                  </Canvas>
                </CanvasStage>
              </Tooltip.Trigger>
              <Tooltip.Content>{hoverInfo?.label}</Tooltip.Content>
            </Tooltip.Root>
          </Suspense>
        </div>
        <div className="pointer-events-none z-50 mr-4 mt-4 justify-self-end [grid-area:1/1]">
          <TimelineControl
            minDate={timeScale.domain()[0]}
            maxDate={timeScale.domain()[1]}
            currentDate={selectedYear}
            setDate={(year: Date | undefined) => setSelectedYear(year)}
          />
          <div className="pointer-events-auto w-[400px]">
            <Card>
              <Card.Header>
                <p className="text-xs italic">Details</p>
              </Card.Header>
              <Card.Body>
                {!selectedYear && !selectedCountries.length ? (
                  <p>Select a country or a year for more details.</p>
                ) : (
                  <>
                    {selectedCountries.length > 0 && (
                      <SelectedProjectsDetails
                        selectedCountries={selectedCountries}
                        projectsByYearCountry={projectsByYearCountry}
                        projects={projects}
                        setSelectedCountries={setSelectedCountries}
                      />
                    )}
                    {selectedYear && (
                      <SelectedYearDetails
                        selectedYear={selectedYear}
                        projectsByYearCountry={projectsByYearCountry}
                        neCountriesTopoJson={neCountriesTopoJson}
                      />
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaceTimeCubeProjects;

const MemoizedSpaceTimeCube = memo(SpaceTimeCube);
