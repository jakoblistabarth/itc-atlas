import { scaleOrdinal, scaleLinear } from "d3";
import { GeoProjection } from "d3-geo";
import { GeoJsonProperties } from "geojson";
import { FC, useState } from "react";
import { ExtrudeGeometryOptions } from "three";
import type { Topology } from "topojson-specification";
import PrismMap from "../PrismMap";
import clsx from "clsx";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BtorsGroupedByCountryByDepartment } from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";

type Props = {
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  topology: Topology;
  topologyObject: string;
  projection: GeoProjection;
  width: number;
  length: number;
  extrudeGeometryOptions?: ExtrudeGeometryOptions;
};

const TravelsByDepartmentPrismMap: FC<Props> = ({
  btorsByCountryByDepartment,
  topology,
  topologyObject,
  projection,
  width,
  length,
  extrudeGeometryOptions = {},
}) => {
  const ITC = ["EOS", "AES", "GIP", "NRS", "PGM", "WRS", "VAR"];
  const [activeDepartment, setActiveDepartment] = useState<string | undefined>(
    undefined,
  );
  const map = new Map<string, GeoJsonProperties>();
  Array.from(btorsByCountryByDepartment)
    .map((d) => {
      d[1]
        .filter((d1) => d1.departmentId == activeDepartment)
        .map((d2) =>
          d2
            ? map.set(d2.country, {
                value: d2.count,
                category: "important",
              })
            : [],
        );
      return map;
    })
    .filter((d) => d.size > 0);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div className="pn-2 scroll mb-2 mt-2 flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
        {ITC.map((d) => (
          <button
            key={d}
            className={clsx(
              "border-1 min-w-[80px] border-solid",
              activeDepartment === d
                ? "border-itc-green"
                : "border-transparent",
            )}
            onClick={() => setActiveDepartment(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <Canvas orthographic camera={{ position: [0, 5, 5], zoom: 75 }} shadows>
        <Environment preset="apartment" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={5}
          castShadow
          shadow-bias={-0.0001}
        />
        <AccumulativeShadows opacity={0.25}>
          <RandomizedLight position={[10, 10, 5]} />
        </AccumulativeShadows>
        <PrismMap
          topology={topology}
          topologyObject={topologyObject}
          projection={projection}
          width={width}
          length={length}
          colorScale={scaleOrdinal<string, string, string>()
            .domain(["important", "very important"])
            .range(["teal", "orange"])
            .unknown("ligthgrey")}
          colorPropertyAccessor={(properties) => properties?.category}
          extrusionPropertyAccessor={(properties) => properties?.value}
          extrusionScale={scaleLinear()
            .domain([0, 100])
            .range([0.01, 2])
            .unknown(0.01)}
          extrudeGeometryOptions={extrudeGeometryOptions}
          featureProperties={map}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default TravelsByDepartmentPrismMap;
