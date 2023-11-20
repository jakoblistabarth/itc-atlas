import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { max, min, scaleTime } from "d3";
import { FC, Suspense, memo, useCallback, useMemo, useState } from "react";
import { HiCursorClick } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import Button from "../../components/Button";
import Callout from "../../components/Callout/Callout";
import CanvasStage from "../../components/CanvasStage";
import Skeleton from "../../components/Skeleton";
import { ProjectsWithCountries } from "../../lib/data/queries/project/getProjectsWithCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import SelectedProjectsDetails from "./SelectedProjectsDetails";
import useProjectEvents from "./useProjectEvents.hooks";
import Tooltip from "../Tooltip";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import TooltipContent from "../Tooltip/TooltipContent";
import SpaceTimeCube from "../../components/SpaceTimeCube/SpaceTimeCube";

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
    const maxDate = max(events.map((d) => d.dateEnd ?? new Date()));
    return scaleTime<number, number>()
      .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
      .range([0, height])
      .nice();
  }, [events, height]);

  /**
   * TODO:
   * 1. use timeScales domain instead of hardcoded Array
   * 2. create datalist options dynamically
   */
  const years = Array.from(new Array(2026).keys()).slice(1985);
  return (
    <>
      <Callout Icon={HiCursorClick}>
        Select individual countries to only see projects related to them. Select
        certain year in the box to see all projects for this year.
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
          <SelectedProjectsDetails
            selectedCountries={selectedCountries}
            projectsByYearCountry={projectsByYearCountry}
            projects={projects}
            setSelectedCountries={setSelectedCountries}
          />
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
