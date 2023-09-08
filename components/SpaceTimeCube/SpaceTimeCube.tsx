import { Text3D, Html } from "@react-three/drei";
import { max, min, scaleTime } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import React, { FC } from "react";
import lonLatTimeToXYZ from "../../lib/helpers/lonLatTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import type { Topology } from "topojson-specification";
import { useMemo } from "react";
import { SVGLoader } from "three-stdlib";
import { feature } from "topojson-client";
import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import { featureCollectionToSVG } from "../ExtrudedGeometries/ExtrudedGeometries.helpers";
import { geoPath, GeoProjection } from "d3-geo";
import { useEffect, useState } from "react";
import { Color, DoubleSide, Vector3 } from "three";

type PropTypes = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  topology: Topology;
  topologyObject: string;
  side?: number;
  height?: number;
  onClickHandler: (featureId?: string) => void;
  activeFeature?: string;
}>;

const SpaceTimeCube: FC<PropTypes> = ({
  events,
  topology,
  topologyObject,
  activeFeature,
  onClickHandler,
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
  ) as GeoProjection;
  const fc = feature(
    topology,
    topology.objects[topologyObject]
  ) as FeatureCollection<MultiPolygon | Polygon, GeoJsonProperties>;
  const svg = featureCollectionToSVG(fc, geoPath(projection));

  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const { paths } = svgData;
  const extrudeGeometryOptions = {
    depth: 0.05,
    bevelSize: 0.005,
    bevelThickness: 0.005,
    bevelSegments: 12,
  };

  const [hoverCountry, setHover] = useState<string | undefined>(undefined);
  const [hoverYear, setYear] = useState<string | undefined>(undefined);

  const shapes = useMemo(
    () =>
      paths.flatMap((p, idx) =>
        p.toShapes(true).map((shape) => ({
          shape,
          fillOpacity: p.userData?.style.fillOpacity,
          name: fc.features[idx].properties?.ADM0_A3,
        }))
      ),
    [paths, fc.features]
  );

  const selectedEvents =
    activeFeature || hoverYear
      ? events.filter(
          (event) =>
            event.name == activeFeature ||
            event.dateStart.toDateString() == hoverYear
        )
      : events;

  useEffect(
    () => void (document.body.style.cursor = hoverCountry ? `pointer` : `auto`),
    [hoverCountry]
  );
  useEffect(
    () =>
      void (document.body.style.cursor = activeFeature ? `pointer` : `auto`),
    [activeFeature]
  );
  useEffect(
    () => void (document.body.style.cursor = hoverYear ? `pointer` : `auto`),
    [hoverYear]
  );

  return (
    <>
      {timeScale.ticks(25).map((t, idx) => {
        return (
          <group key={`${t.getDate()}-${idx}`}>
            <mesh receiveShadow castShadow position={[side + 0.1, 0, 0]}>
              <Text3D
                onPointerEnter={() => setYear(t.toDateString())}
                onPointerLeave={() => setYear(undefined)}
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
                <meshStandardMaterial
                  color={hoverYear == t.toDateString() ? "blue" : "white"}
                />
              </Text3D>
            </mesh>
          </group>
        );
      })}

      {selectedEvents.map((e, idx) => {
        const pos = lonLatTimeToXYZ(
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

      <group position-y={height / -2} rotation={[Math.PI / -2, 0, 0]}>
        {shapes.map((props) => {
          const centroidLatLong = getCentroidByIsoCode(props.name);
          const centroid = projection([
            centroidLatLong?.x ?? 0,
            centroidLatLong?.y ?? 0,
          ]);
          const position = centroid ? new Vector3(...centroid, -1) : undefined;
          return (
            <mesh
              key={props.shape.uuid}
              onPointerDown={() => {
                activeFeature === props.name
                  ? onClickHandler(undefined)
                  : onClickHandler(props.name);
              }}
              onPointerEnter={() => setHover(props.name)}
              onPointerLeave={() => setHover(undefined)}
              rotation={[Math.PI, 0, 0]} // taking into account the origin of svg coordinates in the top left rather than in the center
            >
              <extrudeGeometry
                args={[props.shape, { ...extrudeGeometryOptions }]}
              />
              <meshStandardMaterial
                color={
                  activeFeature == props.name
                    ? new Color("black")
                    : hoverCountry == props.name
                    ? new Color("grey")
                    : new Color("white")
                }
                opacity={props.fillOpacity}
                depthWrite={true}
                side={DoubleSide}
                transparent
              />
              {hoverCountry == props.name && position && (
                <Html
                  style={{
                    color: "white",
                    textAlign: "left",
                    background: "#fcaf17",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                  position={position}
                >
                  <div>{hoverCountry}</div>
                </Html>
              )}
            </mesh>
          );
        })}
      </group>
    </>
  );
};

export default SpaceTimeCube;
