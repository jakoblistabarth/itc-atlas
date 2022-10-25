import { FC, useState } from "react";
import type { Position } from "geojson";
import lonLatToXYZ from "../../lib/cartographic/lonLatToXYZ";
import Point3D from "./Point3D";
import getFlowCurve3D from "../../lib/cartographic/getFlowCurve3D";
import { scaleLinear } from "d3";
import { nanoid } from "nanoid";
import type { GeoJsonProperties } from "geojson";

const Flow3D: FC<{
  origin: Position;
  destination: Position;
  data: GeoJsonProperties;
  value: number;
  arcHeight?: number;
}> = ({ origin, destination, data, value, arcHeight = 0.4 }) => {
  const [hover, setHover] = useState(false);

  const od = [origin, destination].map((pos) => lonLatToXYZ(pos[0], pos[1], 1));
  const curve = getFlowCurve3D(origin, destination, 1, arcHeight);
  const flowScale = scaleLinear().domain([0, 100]).range([0.001, 0.03]);
  const radius = flowScale(value);

  return (
    <>
      {od.map((pos) => (
        <Point3D
          key={nanoid()}
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
        <tubeBufferGeometry args={[curve, 60, radius, 16, false]} />
        <meshStandardMaterial color={hover ? "lightgrey" : "white"} />
      </mesh>
    </>
  );
};

export default Flow3D;
