import { Edges, Text3D } from "@react-three/drei";
import { geoPath, max, min, scaleTime } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { nanoid } from "nanoid";
import React, { FC } from "react";
import lonLatTimeToXYZ from "../../lib/cartographic/lonLatTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import InterRegular from "../../public/fonts/Inter_Regular.json";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import type { Topology } from "topojson-specification";
import PolygonMap3D from "./PolygonMap3D";
import { feature } from "topojson-client";
import simplifyTopology from "../../lib/cartographic/simplifyTopology";
import featureCollectionToSVG from "../../lib/cartographic/featureCollectionToSVG";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

type PropTypes = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  geoData: Topology;
  side?: number;
  height?: number;
}>;

const SpaceTimeCube: FC<PropTypes> = ({
  events,
  geoData,
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

  const countries = simplifyTopology(geoData, 0.5);
  const fc = feature(
    countries,
    countries.objects.ne_admin_0_countries
  ) as FeatureCollection<MultiPolygon | Polygon>;
  const svg = featureCollectionToSVG(fc, geoPath(projection));

  return (
    <>
      {/* <mesh castShadow receiveShadow>
        <boxGeometry args={[side, height, side]} />
        <meshStandardMaterial opacity={0} transparent />
        <Edges color={"white"} />
      </mesh> */}
      {timeScale.ticks().map((t) => {
        return (
          <group key={nanoid()}>
            {/* <mesh
              receiveShadow
              castShadow
              position={[0, timeScale(t), 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeBufferGeometry args={[side, side]} />
              <meshStandardMaterial transparent opacity={0} />
              <Edges color={"white"} />
            </mesh> */}
            <mesh receiveShadow castShadow position={[side + 0.1, 0, 0]}>
              <Text3D
                receiveShadow
                castShadow
                font={InterRegular}
                position={[-side / 2, timeScale(t) - fontSize / 2, side * 0.52]}
                size={fontSize}
                height={fontSize / 50}
                bevelEnabled
                bevelThickness={0.005}
                bevelSize={0.0001}
                curveSegments={2}
              >
                {fDateYear(t)}
                <meshStandardMaterial key={nanoid()} color={"white"} />
              </Text3D>
            </mesh>
          </group>
        );
      })}
      {events.map((e) => {
        const pos = lonLatTimeToXYZ(
          e.coordinates,
          e.dateStart,
          timeScale,
          projection
        );
        return (
          <mesh key={nanoid()} position={pos}>
            <boxBufferGeometry
              args={[(e.size ?? 1) / 200, eventSide / 5, (e.size ?? 1) / 200]}
            />
            <meshPhongMaterial color={"teal"} />
          </mesh>
        );
      })}
      <group position-y={height / -2}>
        <PolygonMap3D
          svg={svg}
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
