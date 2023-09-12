import { FC, useState } from "react";
import type { Position } from "geojson";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import Mark3dSphere from "../Mark3dSphere";
import { getFlowCurve3D } from "./Mark3dFlow.helpers";
import { scaleLinear } from "d3";
import type { GeoJsonProperties } from "geojson";

const Mark3dFlow: FC<{
  origin: Position;
  destination: Position;
  data: GeoJsonProperties;
  value: number;
  arcHeight?: number;
}> = ({ origin, destination, data, value, arcHeight = 0.4 }) => {
  const [hover, setHover] = useState(false);

  const od = [origin, destination].map((pos) =>
    longitudeLatitudeToXYZ(pos[0], pos[1], 1)
  );
  const curve = getFlowCurve3D(origin, destination, 1, arcHeight);
  const flowScale = scaleLinear().domain([0, 100]).range([0.001, 0.03]);
  const radius = flowScale(value);

  return (
    <>
      {od.map((pos, idx) => (
        <Mark3dSphere
          key={idx}
          pos={pos}
          radius={0.005}
          data={{ name: "od" }}
        />
      ))}
      <mesh
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => console.log(data)}
        castShadow
        receiveShadow
      >
        <tubeGeometry args={[curve, 60, radius, 16, false]} />
        <meshStandardMaterial color={hover ? "lightgrey" : "white"} />
      </mesh>
    </>
  );
};

export default Mark3dFlow;
