import { Department } from "@prisma/client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { scaleLinear } from "d3";
import { GeoProjection } from "d3-geo";
import { GeoJsonProperties } from "geojson";
import { FC, useCallback, useMemo, useState } from "react";
import { ExtrudeGeometryOptions } from "three";
import type { Topology } from "topojson-specification";
import { BtorsGroupedByCountryByDepartment } from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import { FeatureIdentifier } from "../../types/FeatureIdentifier";
import CanvasStage from "../CanvasStage";
import KPI from "../KPI";
import { MemoizedPrismMap } from "../PrismMap";
import PrismMapEnvironment from "../PrismMapEnvironment";
import Tooltip from "../Tooltip";

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

const PrismMapTravelsDepartment: FC<Props> = ({
  btorsByCountryByDepartment,
  topology,
  topologyObject,
  projection,
  width,
  length,
  //TODO: check why performance is bad if extrude options are not set
  extrudeGeometryOptions = {
    depth: 0.01,
    bevelSize: 0.005,
    bevelThickness: 0.005,
    bevelSegments: 12,
  },
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
          ?.map(({ isoAlpha3, count }) => [isoAlpha3, { count }]),
      ),
    [department, btorsByCountryByDepartment],
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
              <PrismMapEnvironment />
              <MemoizedPrismMap
                topology={topology}
                topologyObject={topologyObject}
                projection={projection}
                width={width}
                length={length}
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
                ?.find((d) => d.isoAlpha3 === hoverInfo?.id)?.count ?? 0
            }
          />
          {hoverInfo?.label}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};

export default PrismMapTravelsDepartment;
