import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as d3 from "d3";
import type { GeoJsonProperties } from "geojson";
import { FC, Suspense, memo, useCallback, useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import Globe, { FallBackGlobe } from "../../components/Globe/";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import KPI from "../../components/KPI";
import Mark3dFlow from "../../components/Mark3dFlow";
import Tooltip from "../../components/Tooltip";
import type { OdMatrix } from "../../types/OdMatrix";
import { useTheme } from "next-themes";

type Props = {
  odMatrix: OdMatrix;
};

const earthRadius = 1;

const Flights3D: FC<Props> = ({ odMatrix }) => {
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);

  const [ready, setReady] = useState(false);

  const { theme } = useTheme();

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
        <Tooltip.Trigger asChild>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 30 }}
            shadows
            onCreated={() => setReady(true)}
            data-ready={ready}
          >
            <Suspense fallback={<FallBackGlobe radius={earthRadius} />}>
              <Globe
                radius={earthRadius}
                texture={theme === "dark" ? "night" : "explorer"}
              />
            </Suspense>
            <GlobeEnvironment />

            <MemoizedFlows
              odMatrix={odMatrix}
              onPointerEnterHandler={onPointerEnterHandler}
              onPointerLeaveHandler={onPointerLeaveHandler}
            />
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.3}
              enableZoom={false}
              enablePan={false}
            />
          </Canvas>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {hoverInfo &&
            (hoverInfo.name ? (
              <p>
                Airport: <span className="font-bold">{hoverInfo.name}</span>
              </p>
            ) : (
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{hoverInfo?.o}</span>{" "}
                  <HiArrowRight />{" "}
                  <span className="font-bold">{hoverInfo?.d}</span>
                </div>
                <br />
                <KPI number={hoverInfo.value} unit={"travels"} />
                <p>in 2019</p>
              </div>
            ))}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};

export default Flights3D;

const Flows: FC<{
  odMatrix: OdMatrix;
  onPointerEnterHandler?: (properties: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
}> = ({ odMatrix, onPointerEnterHandler, onPointerLeaveHandler }) => {
  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value,
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scaleWidth = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 100])
    .range([0, 100]);
  return (
    <>
      {/* {odMatrix.flows.features.map((flow) => { */}
      {odMatrix.flows.features.map((flow) => {
        const originPosition = flow.geometry.coordinates[0];
        const originAirport = flow.properties.o;
        const destinationPosition = flow.geometry.coordinates[1];
        const destinationAirport = flow.properties.d;
        return (
          <Mark3dFlow
            key={flow.properties.od}
            origin={{
              position: originPosition,
              airport: originAirport,
            }}
            destination={{
              position: destinationPosition,
              airport: destinationAirport,
            }}
            value={scaleWidth(flow.properties?.value)}
            data={flow.properties}
            onPointerEnterHandler={(props) =>
              onPointerEnterHandler && onPointerEnterHandler(props)
            }
            onPointerLeaveHandler={() =>
              onPointerLeaveHandler && onPointerLeaveHandler()
            }
          />
        );
      })}
    </>
  );
};

const MemoizedFlows = memo(Flows);
