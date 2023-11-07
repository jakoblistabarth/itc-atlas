import { scaleLinear, scaleQuantile, schemeBlues } from "d3";
import { GeoProjection } from "d3-geo";
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
import { Department } from "@prisma/client";

type Props = {
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  topology: Topology;
  topologyObject: string;
  projection: GeoProjection;
  width: number;
  length: number;
  extrudeGeometryOptions?: ExtrudeGeometryOptions;
  departments: Department[];
};

const TravelsByDepartmentPrismMap: FC<Props> = ({
  btorsByCountryByDepartment,
  topology,
  topologyObject,
  projection,
  width,
  length,
  extrudeGeometryOptions = {},
  departments,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<string>(
    departments[0].id,
  );
  const featureProperties = new Map(
    btorsByCountryByDepartment
      .get(activeDepartment)
      ?.map(({ country, count }) => [country, { count }]),
  );

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div className="pn-2 scroll mb-2 mt-2 flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
        {departments.map((department) => (
          <button
            key={department.id}
            className={clsx(
              "border-1 min-w-[80px] border-solid",
              activeDepartment === department.id
                ? "border-itc-green"
                : "border-transparent",
            )}
            onClick={() => setActiveDepartment(department.id)}
          >
            {department.id}
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
          colorScale={scaleQuantile<string, string>()
            .domain(Array.from(featureProperties.values()).map((d) => d.count))
            .range(schemeBlues[5])
            .unknown("ligthgrey")}
          colorPropertyAccessor={(properties) => properties?.count}
          extrusionPropertyAccessor={(properties) => properties?.count}
          extrusionScale={scaleLinear()
            .domain([0, 100])
            .range([0.01, 2])
            .unknown(0.01)}
          extrudeGeometryOptions={extrudeGeometryOptions}
          featureProperties={featureProperties}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default TravelsByDepartmentPrismMap;
