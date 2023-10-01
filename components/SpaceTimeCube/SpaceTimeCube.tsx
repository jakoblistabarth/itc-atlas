import { Text3D } from "@react-three/drei";
import { max, min, scaleTime } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import React, { FC } from "react";
import longitudeLatitudeTimeToXYZ from "../../lib/helpers/longitudeLatitudeTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import type { Topology } from "topojson-specification";
import PrismMap from "../PrismMap";

type PropTypes = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  topology: Topology;
  topologyObject: string;
  side?: number;
  height?: number;
}>;

const SpaceTimeCube: FC<PropTypes> = ({
  events,
  topology,
  topologyObject,
  side = 10,
  height = 10,
}) => {
  const minDate = min(events.map((d) => d.dateStart));
  const maxDate = max(events.map((d) => d.dateEnd ?? new Date()));
  const timeScale = scaleTime<number, number>()
    .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
    .range([height / -2, height / 2])
    .nice();

  const eventSide = height / timeScale.ticks().length;
  const fontSize = eventSide / 5;
  const projection = geoBertin1953().fitExtent(
    [
      [-side / 2, -side / 2],
      [side / 2, side / 2],
    ],
    {
      type: "Sphere",
    }
  );

  return (
    <>
      {timeScale.ticks().map((t, idx) => {
        return (
          <group key={`${t.getDate()}-${idx}`}>
            {/* <mesh
              receiveShadow
              castShadow
              position={[0, timeScale(t), 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[side, side]} />
              <meshStandardMaterial transparent opacity={0} />
              <Edges color={"white"} />
            </mesh> */}
            <mesh receiveShadow castShadow position={[side + 0.1, 0, 0]}>
              <Text3D
                receiveShadow
                castShadow
                font={"/fonts/Inter_Regular.json"}
                position={[-side / 2, timeScale(t) - fontSize / 2, side * 0.52]}
                size={fontSize}
                height={fontSize / 50}
                bevelEnabled
                bevelThickness={0.005}
                bevelSize={0.0001}
                curveSegments={2}
              >
                {fDateYear(t)}
                <meshStandardMaterial color={"white"} />
              </Text3D>
            </mesh>
          </group>
        );
      })}
      {events.map((e, idx) => {
        const pos = longitudeLatitudeTimeToXYZ(
          e.coordinates,
          e.dateStart,
          timeScale,
          projection
        );
        return (
          <mesh key={`${e.name}-${idx}`} position={pos}>
            <boxGeometry
              args={[(e.size ?? 1) / 200, eventSide / 5, (e.size ?? 1) / 200]}
            />
            <meshPhongMaterial color={"teal"} />
          </mesh>
        );
      })}
      <group position-y={height / -2}>
        <PrismMap
          topology={topology}
          topologyObject={topologyObject}
          width={side}
          length={side}
          projection={projection}
          color={"white"}
          extrudeGeometryOptions={{
            depth: 0.05,
            bevelSize: 0.005,
            bevelThickness: 0.005,
            bevelSegments: 12,
          }}
        />
      </group>
    </>
  );
};

export default SpaceTimeCube;
