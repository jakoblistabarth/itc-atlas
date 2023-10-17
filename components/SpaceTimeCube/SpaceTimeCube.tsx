/** @jsxImportSource theme-ui */

import { Html, Text3D } from "@react-three/drei";
import { ScaleTime, group, union } from "d3";
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
import longitudeLatitudeTimeToXYZ from "../../lib/helpers/longitudeLatitudeTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import { featureCollectionToSVG } from "../ExtrudedGeometries/ExtrudedGeometries.helpers";
import PlaneOutline from "../PlaneOutline";

type PropTypes = React.PropsWithChildren<{
  events: SpaceTimeCubeEvent[];
  topology: Topology;
  topologyObject: string;
  side?: number;
  height?: number;
  timeScale: ScaleTime<number, number>;
  onPointerDownHandler: (featureId: string) => void;
  selectedFeatureIds: string[];
  selectedYear?: string;
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
  timeScale,
  selectedYear,
  selectedFeatureIds,
  onPointerDownHandler,
  side = 10,
  height = 10,
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | undefined>(
    undefined
  );

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
        pos: longitudeLatitudeTimeToXYZ(
          e.coordinates,
          e.dateStart,
          timeScale,
          projection
        ),
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
    selectedFeatureIds.length != 0 || selectedYear
      ? eventsWithPosition.filter(
          (event) =>
            selectedFeatureIds.includes(event.name) ||
            (selectedYear &&
              event.dateStart.getFullYear().toString() === selectedYear)
        )
      : eventsWithPosition;

  return (
    <>
      <group
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
      >
        {timeScale.ticks(10).map((t, idx) => {
          const isActiveYear =
            selectedYear && t.getFullYear().toString() === selectedYear;
          console.log(
            timeScale(new Date(selectedYear ?? 1985)) -
              timeScale(new Date(1985))
          );
          return (
            <group
              key={`${t.getDate()}-${idx}`}
              position={[0, timeScale(t), 0]}
            >
              <PlaneOutline
                side={side}
                color="teal"
                lineWidth={isActiveYear ? 2 : 0.5}
              />
              <mesh>
                <Text3D
                  receiveShadow
                  castShadow
                  font={"/fonts/Inter_Regular.json"}
                  position={[side / 2 + 0.5, 0, side * 0.5]}
                  size={fontSize}
                  height={fontSize / 50}
                  bevelEnabled
                  bevelThickness={0.005}
                  bevelSize={0.0001}
                  curveSegments={2}
                  material={isActiveYear ? materials.teal : materials.white}
                >
                  {fDateYear(t)}
                </Text3D>
              </mesh>
            </group>
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

      {selectedYear && (
        <group position={[0, timeScale(new Date(selectedYear)), 0]}>
          <PlaneOutline side={side} color="teal" lineWidth={2} />
          <mesh>
            <Text3D
              receiveShadow
              castShadow
              font={"/fonts/Inter_Regular.json"}
              position={[side / 2 + 0.5, 0, side * 0.5]}
              size={fontSize}
              height={fontSize / 50}
              bevelEnabled
              bevelThickness={0.005}
              bevelSize={0.0001}
              curveSegments={2}
              material={materials.teal}
            >
              {selectedYear}
            </Text3D>
          </mesh>
        </group>
      )}

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
              position-z={
                ((parseInt(selectedYear ?? "1985") - 1985) * height) / 40
              }
              key={country}
              onPointerDown={() => onPointerDownHandler(country)}
              onPointerEnter={() => setHoveredCountry(country)}
              onPointerLeave={() => setHoveredCountry(undefined)}
              rotation={[Math.PI, 0, 0]} // taking into account the origin of svg coordinates in the top left rather than in the center
            >
              {shapes.map((shape) => (
                <mesh
                  key={shape.shape.uuid}
                  material={
                    selectedFeatureIds?.includes(country)
                      ? materials.blue
                      : hoveredCountry == country
                      ? materials.grey
                      : materials.white
                  }
                >
                  <extrudeGeometry
                    args={[shape.shape, { ...extrudeGeometryOptions }]}
                  />
                </mesh>
              ))}

              {hoveredCountry == country && position && (
                <Html
                  sx={{
                    color: "primary",
                    textAlign: "left",
                    background: "background",
                    boxShadow: 1,
                    padding: "5px 10px",
                    borderRadius: 1,
                    pointerEvents: "none",
                    fontWeight: selectedFeatureIds?.includes(country)
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
