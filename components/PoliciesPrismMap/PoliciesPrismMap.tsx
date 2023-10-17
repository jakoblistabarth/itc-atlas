import { Canvas } from "@react-three/fiber";
import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import PrismMap from "../PrismMap";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { BhosCountry } from "../../types/BhosCountry";
import { max, rollup, scaleLinear, scaleOrdinal } from "d3";

type Props = {
  topology: NeCountriesTopoJson;
  bhosCountries: BhosCountry[];
};

const PoliciesPrismMap: FC<Props> = ({ topology, bhosCountries }) => {
  const featureProperties = rollup(
    bhosCountries.filter((d) => d.category == "General Focus Country"),
    (v) => ({ value: v.length, category: v[0].category }),
    (d) => d.isoAlpha3
  );
  const maxValue =
    max(Array.from(featureProperties.values()), (d) => d.value) ?? 2;

  return (
    <Canvas shadows orthographic camera={{ zoom: 75, position: [0, 5, 3] }}>
      <PrismMap
        topology={topology}
        topologyObject={"ne_admin_0_countries"}
        projection={geoBertin1953()}
        width={10}
        length={10}
        colorScale={scaleOrdinal<string, string>()
          .domain(["General Focus Country"])
          .range(["teal"])}
        colorPropertyAccessor={(properties) => properties?.category}
        extrusionScale={scaleLinear().domain([1, maxValue]).range([0.01, 1.5])}
        extrusionPropertyAccessor={(properties) => properties?.value}
        featureProperties={featureProperties}
        extrudeGeometryOptions={{
          bevelSize: 0.005,
          bevelThickness: 0.005,
          bevelSegments: 12,
        }}
      />
      <Environment preset="city" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={5}
        castShadow
        shadow-bias={-0.0001}
      />
      <AccumulativeShadows opacity={0.25}>
        <RandomizedLight position={[10, 10, 5]} />
      </AccumulativeShadows>
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default PoliciesPrismMap;
