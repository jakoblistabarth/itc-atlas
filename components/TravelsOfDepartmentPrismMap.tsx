import { Department } from "@prisma/client";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { scaleLinear, scaleQuantile, schemeBlues } from "d3";
import { GeoProjection } from "d3-geo";
import { GeoJsonProperties } from "geojson";
import { FC, useCallback, useMemo, useState } from "react";
import { ExtrudeGeometryOptions } from "three";
import type { Topology } from "topojson-specification";
import { BtorsGroupedByCountryByDepartment } from "../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import { FeatureIdentifier } from "../types/FeatureIdentifier";
import KPI from "./KPI";
import { MemoizedPrismMap } from "./PrismMap";
import SoftLight from "./SoftLight";
import Tooltip from "./Tooltip";
import CanvasStage from "./CanvasStage";

type Props = {
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  topology: Topology;
  topologyObject: string;
  projection: GeoProjection;
  width: number;
  length: number;
  extrudeGeometryOptions?: ExtrudeGeometryOptions;
  department: Department;
};

const TravelsOfDepartmentPrismMap: FC<Props> = ({
  btorsByCountryByDepartment,
  topology,
  topologyObject,
  projection,
  width,
  length,
  extrudeGeometryOptions = {},
  department,
}) => {
  const [hoverInfo, setHoverInfo] = useState<FeatureIdentifier | undefined>(
    undefined,
  );
  const featureProperties = useMemo(
    () =>
      new Map(
        btorsByCountryByDepartment
          .get(department.id)
          ?.map(({ country, count }) => [country, { count }]),
      ),
    [department, btorsByCountryByDepartment],
  );
  const colorScale = useMemo(
    () =>
      scaleQuantile<string, string>()
        .domain(Array.from(featureProperties.values()).map((d) => d.count))
        .range(schemeBlues[5])
        .unknown("ligthgrey"),
    [featureProperties],
  );

  const propertyAccessor = useCallback(
    (properties: GeoJsonProperties) => properties?.count,
    [],
  );
  const onPointerEnterHandler = useCallback(
    (d: FeatureIdentifier) => setHoverInfo(d),
    [],
  );
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const extrusionScale = useMemo(
    () => scaleLinear().domain([0, 100]).range([0.01, 2]).unknown(0.01),
    [],
  );
  return (
    <div>
      <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
        <Tooltip.Trigger asChild>
          <CanvasStage className="h-[500px]">
            <Canvas
              orthographic
              camera={{ position: [0, 5, 5], zoom: 75 }}
              shadows
            >
              <Environment preset="apartment" />
              <directionalLight
                position={[10, 10, 5]}
                intensity={5}
                castShadow
                shadow-bias={-0.0001}
              />
              <AccumulativeShadows frames={0} opacity={0.2}>
                <SoftLight position={[10, 10, 5]} />
              </AccumulativeShadows>
              <MemoizedPrismMap
                topology={topology}
                topologyObject={topologyObject}
                projection={projection}
                width={width}
                length={length}
                colorScale={colorScale}
                colorPropertyAccessor={propertyAccessor}
                extrusionPropertyAccessor={propertyAccessor}
                extrusionScale={extrusionScale}
                onFeaturePointerEnterHandler={onPointerEnterHandler}
                onFeaturePointerLeaveHandler={onPointerLeaveHandler}
                extrudeGeometryOptions={extrudeGeometryOptions}
                featureProperties={featureProperties}
              />
              <OrbitControls
                maxZoom={200}
                minZoom={50}
                makeDefault
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </CanvasStage>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <KPI
            unit="travels"
            number={
              btorsByCountryByDepartment
                ?.get(department.id)
                ?.find((d) => d.country === hoverInfo?.id)?.count ?? 0
            }
          />
          {hoverInfo?.label}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};

export default TravelsOfDepartmentPrismMap;
