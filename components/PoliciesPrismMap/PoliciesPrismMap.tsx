import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { max, rollup, scaleLinear, scaleOrdinal } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { GeoJsonProperties } from "geojson";
import { FC, useCallback, useMemo, useState } from "react";
import { BhosCountry } from "../../types/BhosCountry";
import { FeatureIdentifier } from "../../types/FeatureIdentifier";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import KPI from "../KPI";
import { MemoizedPrismMap } from "../PrismMap";
import SoftLight from "../SoftLight";
import Tooltip from "../Tooltip";

type Props = {
  topology: NeCountriesTopoJson;
  bhosCountries: BhosCountry[];
};

const PoliciesPrismMap: FC<Props> = ({ topology, bhosCountries }) => {
  const [hoveredFeature, setHoveredFeature] = useState<
    FeatureIdentifier | undefined
  >(undefined);
  const { projection, colorScale, extrudeGeometryOptions } = useMemo(() => {
    const projection = geoBertin1953();
    const colorScale = scaleOrdinal<string, string>()
      .domain(["General Focus Country"])
      .range(["teal"]);
    const extrudeGeometryOptions = {
      bevelSize: 0.005,
      bevelThickness: 0.005,
      bevelSegments: 12,
    };
    return { projection, colorScale, extrudeGeometryOptions };
  }, []);
  const { featureProperties, extrusionScale } = useMemo(() => {
    const featureProperties = rollup(
      bhosCountries.filter((d) => d.category == "General Focus Country"),
      (v) => ({ value: v.length, category: v[0].category }),
      (d) => d.isoAlpha3,
    );
    const maxValue =
      max(Array.from(featureProperties.values()), (d) => d.value) ?? 2;
    const extrusionScale = scaleLinear()
      .domain([1, maxValue])
      .range([0.01, 1.5]);
    return { featureProperties, extrusionScale };
  }, [bhosCountries]);

  const onPointerEnterHandler = useCallback(
    (f: FeatureIdentifier) => setHoveredFeature(f),
    [],
  );
  const onPointerLeaveHandler = useCallback(
    () => setHoveredFeature(undefined),
    [],
  );
  const extrusionPropertyAccessor = useCallback(
    (properties: GeoJsonProperties) => properties?.value,
    [],
  );
  const colorPropertyAccessor = useCallback(
    (properties: GeoJsonProperties) => properties?.category,
    [],
  );

  return (
    <>
      <Tooltip.Root followCursor open={!!hoveredFeature} placement="top-start">
        <Tooltip.Trigger asChild>
          <Canvas
            shadows
            orthographic
            camera={{ zoom: 75, position: [0, 5, 3] }}
          >
            <MemoizedPrismMap
              topology={topology}
              topologyObject={"ne_admin_0_countries"}
              projection={projection}
              width={10}
              length={10}
              colorScale={colorScale}
              colorPropertyAccessor={colorPropertyAccessor}
              extrusionScale={extrusionScale}
              extrusionPropertyAccessor={extrusionPropertyAccessor}
              featureProperties={featureProperties}
              extrudeGeometryOptions={extrudeGeometryOptions}
              onFeaturePointerEnterHandler={onPointerEnterHandler}
              onFeaturePointerLeaveHandler={onPointerLeaveHandler}
            />
            <Environment preset="city" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={5}
              castShadow
              shadow-bias={-0.0001}
            />
            <AccumulativeShadows frames={0} opacity={0.1}>
              <SoftLight position={[10, 10, 5]} />
            </AccumulativeShadows>
            <OrbitControls
              makeDefault
              maxPolarAngle={Math.PI / 2}
              maxZoom={200}
              minZoom={50}
            />
          </Canvas>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {hoveredFeature && (
            <KPI
              number={featureProperties.get(hoveredFeature?.id)?.value ?? 0}
            />
          )}
          {hoveredFeature?.label}
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  );
};

export default PoliciesPrismMap;
