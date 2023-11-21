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
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { Card } from "../Card";
import SelectedYearDetails from "../SelectedYearDetails/SelectedYearDetails";
import TimelineControl from "../TimelineControl";
import Tooltip from "../Tooltip";
import TooltipContent from "../Tooltip/TooltipContent";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import SelectedProjectsDetails from "./SelectedProjectsDetails";
import useProjectEvents from "./useProjectEvents.hooks";

type selectedCountry = {
  id: string;
  label: string;
};

type Props = {
  projects: ProjectsWithCountries;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const SpaceTimeCubeProjects: FC<Props> = ({
  projects,
  neCountriesTopoJson,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<selectedCountry[]>(
    [],
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  );
  const [hoverInfo, setHoverInfo] = useState<selectedCountry | undefined>(
    undefined,
  );

  const { events, projectsByYearCountry } = useProjectEvents(projects);

  const onPointerEnterHandler = useCallback((feature: selectedCountry) => {
    setHoverInfo(feature);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const onPointerDownHandler = useCallback((feature: selectedCountry) => {
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
          <Suspense
            fallback={
              <div className="h-[700px]">
                <Skeleton />
              </div>
            }
          >
            <Tooltip open={!!hoverInfo} followCursor placement="top-start">
              <TooltipTrigger asChild>
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
                    <MemoizedShadows />
                  </Canvas>
                </CanvasStage>
              </TooltipTrigger>
              <TooltipContent>{hoverInfo?.label}</TooltipContent>
            </Tooltip>
          </Suspense>
        </div>
        <div className="pointer-events-none z-50 mr-4 mt-4 justify-self-end [grid-area:1/1]">
          <TimelineControl
            minDate={timeScale.domain()[0]}
            maxDate={timeScale.domain()[1]}
            currentDate={selectedYear}
            setDate={(year: string | undefined) => setSelectedYear(year)}
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

const Shadows: FC = () => (
  <AccumulativeShadows opacity={0.5} resolution={2 ** 12} scale={30}>
    <directionalLight intensity={5} position={[10, 10, 0]} castShadow />
  </AccumulativeShadows>
);
const MemoizedShadows = memo(Shadows);
