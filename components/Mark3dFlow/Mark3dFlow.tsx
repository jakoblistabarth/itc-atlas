import { FC, useState } from "react";
import type { Position } from "geojson";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import Mark3dSphere from "../Mark3dSphere";
import { getFlowCurve3D } from "./Mark3dFlow.helpers";
import { scaleLinear } from "d3";
import type { GeoJsonProperties } from "geojson";
import { useCursor } from "@react-three/drei";

type Point = {
  position: Position;
  airport: string;
};

const Mark3dFlow: FC<{
  origin: Point;
  destination: Point;
  data: GeoJsonProperties;
  value: number;
  arcHeight?: number;
  onPointerEnterHandler: (properties: GeoJsonProperties) => void;
  onPointerLeaveHandler: () => void;
}> = ({
  origin,
  destination,
  data,
  value,
  arcHeight = 0.4,
  onPointerEnterHandler,
  onPointerLeaveHandler,
}) => {
  const [hover, setHover] = useState(false);
  useCursor(hover);

  const od = [origin.position, destination.position].map((pos) =>
    longitudeLatitudeToXYZ(pos[0], pos[1], 1),
  );
  const curve = getFlowCurve3D(
    origin.position,
    destination.position,
    1,
    arcHeight,
  );
  const flowScale = scaleLinear().domain([0, 100]).range([0.001, 0.03]);
  const radius = flowScale(value);

  return (
    <>
      {od.map((pos, idx) => {
        //TODO: add country or other props to airport
        const info =
          idx == 0 ? { name: origin.airport } : { name: destination.airport };
        return (
          <Mark3dSphere
            key={idx}
            pos={pos}
            radius={0.005}
            onPointerEnterHandler={() => onPointerEnterHandler(info)}
            onPointerLeaveHandler={onPointerLeaveHandler}
          />
        );
      })}
      <mesh
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHover(true);
          onPointerEnterHandler(data);
        }}
        onPointerLeave={() => {
          setHover(false);
          onPointerLeaveHandler();
        }}
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
