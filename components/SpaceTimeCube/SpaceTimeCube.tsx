/** @jsxImportSource theme-ui */

import { Html, Text3D } from "@react-three/drei";
import { group, max, min, scaleTime, union } from "d3";
import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import React, { FC, useMemo, useState } from "react";
import {
  DoubleSide,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { SVGLoader } from "three-stdlib";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import lonLatTimeToXYZ from "../../lib/helpers/lonLatTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import { featureCollectionToSVG } from "../ExtrudedGeometries/ExtrudedGeometries.helpers";

type PropTypes = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  topology: Topology;
  topologyObject: string;
  side?: number;
  height?: number;
  onClickHandler: (featureId?: string) => void;
  onClickCancel: (featureId?: string) => void;
  activeFeatureIds?: string[];
}>;

const teal = new MeshPhongMaterial({ color: "teal" });

const materials = Object.fromEntries(
  ["teal", "white", "grey", "blue"].map((d) => [
    d,
    new MeshStandardMaterial({ color: d, depthWrite: true, side: DoubleSide }),
  ])
);

const SpaceTimeCube: FC<PropTypes> = ({
  events,
  topology,
  topologyObject,
  activeFeatureIds,
  onClickHandler,
  onClickCancel,
  side = 10,
  height = 10,
}) => {
  const [hoverCountry, setHover] = useState<string | undefined>(undefined);
  const [hoverYear, setYear] = useState<string | undefined>(undefined);

  const timeScale = useMemo(() => {
    const minDate = min(events.map((d) => d.dateStart));
    const maxDate = max(events.map((d) => d.dateEnd ?? new Date()));
    return scaleTime<number, number>()
      .domain([minDate ?? new Date("1952"), maxDate ?? new Date()])
      .range([height / -2, height / 2])
      .nice();
  }, [events, height]);

  const { eventSide, fontSize, projection } = useMemo(() => {
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
    return { eventSide, fontSize, projection };
  }, [height, side, timeScale]);

  const fc = useMemo(
    () =>
      feature(topology, topology.objects[topologyObject]) as FeatureCollection<
        MultiPolygon | Polygon,
        GeoJsonProperties
      >,
    [topology, topologyObject]
  );

  const paths = useMemo(() => {
    const svg = featureCollectionToSVG(fc, geoPath(projection));
    const loader = new SVGLoader();
    const svgData = loader.parse(svg);
    const { paths } = svgData;
    return paths;
  }, [fc, projection]);

  const countriesWithShapes = useMemo(
    () =>
      group(
        paths.flatMap((p, idx) =>
          p.toShapes(true).map((shape) => ({
            shape,
            fillOpacity: p.userData?.style.fillOpacity,
            name: fc.features[idx].properties?.ADM0_A3 as string,
          }))
        ),
        (d) => d.name
      ),
    [paths, fc.features]
  );

  const centroids = useMemo(
    () =>
      new Map(
        Array.from(union(fc.features.map((d) => d.properties?.ADM0_A3))).map(
          (isoCode) => {
            const centroidLatLon = getCentroidByIsoCode(isoCode);
            const centroid = projection([
              centroidLatLon?.x ?? 0,
              centroidLatLon?.y ?? 0,
            ]);
            const position = centroid
              ? new Vector3(...centroid, -1)
              : undefined;
            return [isoCode, position];
          }
        )
      ),
    [fc, projection]
  );

  const eventsWithPosition = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        pos: lonLatTimeToXYZ(e.coordinates, e.dateStart, timeScale, projection),
      })),
    [events, projection, timeScale]
  );

  const extrudeGeometryOptions = {
    depth: 0.05,
    bevelSize: 0.005,
    bevelThickness: 0.005,
    bevelSegments: 12,
  };

  const selectedEvents =
    activeFeatureIds || hoverYear
      ? eventsWithPosition.filter(
          (event) =>
            activeFeatureIds?.includes(event.name) ||
            event.dateStart.toDateString() == hoverYear
        )
      : eventsWithPosition;

  return (
    <>
      <group
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
      >
        {timeScale.ticks(25).map((t, idx) => {
          return (
            <mesh position={[side + 0.1, 0, 0]} key={`${t.getDate()}-${idx}`}>
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
                material={
                  hoverYear == t.toDateString()
                    ? materials.teal
                    : materials.white
                }
              >
                {fDateYear(t)}
              </Text3D>
            </mesh>
          );
        })}
      </group>

      {selectedEvents.map((e, idx) => (
        <mesh key={`${e.name}-${idx}`} position={e.pos} material={teal}>
          <boxGeometry
            args={[(e.size ?? 1) / 200, eventSide / 5, (e.size ?? 1) / 200]}
          />
        </mesh>
      ))}

      <group
        position-y={height / -2}
        rotation={[Math.PI / -2, 0, 0]}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
      >
        {Array.from(countriesWithShapes).map(([country, shapes]) => {
          const position = centroids.get(country);
          return (
            <group
              key={country}
              onPointerDown={() => {
                activeFeatureIds?.includes(country)
                  ? onClickCancel(country)
                  : onClickHandler(country);
              }}
              onPointerEnter={() => setHover(country)}
              onPointerLeave={() => setHover(undefined)}
              rotation={[Math.PI, 0, 0]} // taking into account the origin of svg coordinates in the top left rather than in the center
            >
              {shapes.map((shape) => (
                <mesh
                  key={shape.shape.uuid}
                  material={
                    activeFeatureIds?.includes(country)
                      ? materials.blue
                      : hoverCountry == country
                      ? materials.grey
                      : materials.white
                  }
                >
                  <extrudeGeometry
                    args={[shape.shape, { ...extrudeGeometryOptions }]}
                  />
                </mesh>
              ))}

              {hoverCountry == country && position && (
                <Html
                  sx={{
                    color: "primary",
                    textAlign: "left",
                    background: "background",
                    boxShadow: 1,
                    padding: "5px 10px",
                    borderRadius: 1,
                    pointerEvents: "none",
                    fontWeight: activeFeatureIds?.includes(country)
                      ? "bold"
                      : "regular",
                  }}
                  position={position}
                >
                  <div>{country}</div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
};

export default SpaceTimeCube;
