import { FC, useState } from "react";
import { Row } from "../../types/DataFrame";
import type { Position } from "geojson";
import lonLatToXYZ from "../../lib/cartographic/lonLatToXYZ";
import Point3D from "./Point3D";
import getFlowCurve3D from "../../lib/cartographic/getFlowCurve3D";
import { scaleLinear } from "d3";
import { nanoid } from "nanoid";

const Flow3D: FC<{
  origin: Position;
  destination: Position;
  data: Row;
  value: number;
}> = ({ origin, destination, data, value }) => {
  const [hover, setHover] = useState(false);

  const od = [origin, destination].map((pos) => lonLatToXYZ(pos[0], pos[1], 1));
  const { curve, vertices } = getFlowCurve3D(origin, destination);

  console.log(vertices);

  const flowScale = scaleLinear().domain([0, 100]).range([0.001, 0.05]);
  const radius = flowScale(value);

  return (
    <>
      {vertices.map((pos) => (
        <Point3D
          key={nanoid()}
          pos={pos}
          radius={0.015}
          data={{ name: "od" }}
        />
      ))}
      <mesh
        onPointerEnter={() => setHover(!hover)}
        onPointerLeave={() => setHover(!hover)}
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

export default Flow3D;
