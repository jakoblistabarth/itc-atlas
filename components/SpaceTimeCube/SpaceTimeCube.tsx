import { Html, Text3D } from "@react-three/drei";
import { ScaleTime, group, max, scaleSqrt, union } from "d3";
import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import React, { FC, useMemo, useState } from "react";
import { MeshStandardMaterial, Vector3 } from "three";
import { SVGLoader } from "three-stdlib";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import longitudeLatitudeTimeToXYZ from "../../lib/helpers/longitudeLatitudeTimeToXYZ";
import { fDateYear } from "../../lib/utilities/formaters";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import { featureCollectionToSVG } from "../PrismMap/PrismMap.helpers";
import PlaneOutline from "../PlaneOutline";
import clsx from "clsx";

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

const materials = Object.fromEntries(
  ["teal", "white", "grey"].map((d) => [
    d,
    new MeshStandardMaterial({ color: d }),
  ]),
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
    undefined,
  );

  const { eventSide, fontSize, projection } = useMemo(() => {
    const eventSide = height / timeScale.ticks().length - 0.5;
    const fontSize = eventSide / 2;
    const projection = geoBertin1953().fitExtent(
      [
        [-side / 2, -side / 2],
        [side / 2, side / 2],
      ],
      {
        type: "Sphere",
      },
    );
    return { eventSide, fontSize, projection };
  }, [height, side, timeScale]);

  const fc = useMemo(
    () =>
      feature(topology, topology.objects[topologyObject]) as FeatureCollection<
        MultiPolygon | Polygon,
        GeoJsonProperties
      >,
    [topology, topologyObject],
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
          })),
        ),
        (d) => d.name,
      ),
    [paths, fc.features],
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
          },
        ),
      ),
    [fc, projection],
  );

  const eventsWithPosition = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        pos: longitudeLatitudeTimeToXYZ(
          e.coordinates,
          e.dateStart,
          timeScale,
          projection,
        ),
      })),
    [events, projection, timeScale],
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
              event.dateStart.getFullYear().toString() === selectedYear),
        )
      : eventsWithPosition;

  const sizeScale = scaleSqrt()
    .domain([0, max(selectedEvents, (d) => d.size) ?? 1])
    .range([0, eventSide]);

  return (
    <>
      <group position-y={eventSide / 2}>
        <group
          onPointerEnter={() => (document.body.style.cursor = "pointer")}
          onPointerLeave={() => (document.body.style.cursor = "auto")}
        >
          {timeScale.ticks(10).map((t, idx) => {
            const isActiveYear =
              selectedYear && t.getFullYear().toString() === selectedYear;
            return (
              <group
                key={`${t.getDate()}-${idx}`}
                position={[0, timeScale(t), 0]}
              >
                <PlaneOutline
                  side={side}
                  color="grey"
                  lineWidth={isActiveYear ? 2 : 0.5}
                />
                <mesh>
                  <Text3D
                    receiveShadow
                    castShadow
                    font={"/fonts/Inter_Regular.json"}
                    position={[side / 2 + 0.25, 0, side * 0.5]}
                    size={fontSize}
                    height={fontSize / 50}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.005}
                    curveSegments={4}
                    material={isActiveYear ? materials.teal : materials.grey}
                  >
                    {fDateYear(t)}
                  </Text3D>
                </mesh>
              </group>
            );
          })}
        </group>

        {selectedEvents.map((e, idx) => (
          <mesh
            castShadow
            receiveShadow
            key={`${e.name}-${idx}`}
            position={e.pos}
          >
            <sphereGeometry args={[e.size ? sizeScale(e.size) / 2 : 0]} />
            <meshPhysicalMaterial color="teal" roughness={0.2} />
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
                position={[side / 2 + 0.25, 0, side * 0.5]}
                size={fontSize}
                height={fontSize / 50}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.005}
                curveSegments={4}
                material={materials.teal}
              >
                {selectedYear}
              </Text3D>
            </mesh>
          </group>
        )}
      </group>

      <group
        rotation-x={Math.PI / -2}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
      >
        {Array.from(countriesWithShapes).map(([country, shapes]) => {
          const position = centroids.get(country);
          return (
            <group
              position-z={
                ((parseInt(selectedYear ?? "1985") - 1985) * height) / 40 - 0.05
              }
              key={country}
              onPointerDown={() => onPointerDownHandler(country)}
              onPointerEnter={() => setHoveredCountry(country)}
              onPointerLeave={() => setHoveredCountry(undefined)}
              rotation-x={Math.PI} // taking into account the origin of svg coordinates in the top left rather than in the center
            >
              {shapes.map((shape) => (
                <mesh
                  castShadow
                  receiveShadow
                  key={shape.shape.uuid}
                  material={
                    selectedFeatureIds?.includes(country)
                      ? materials.teal
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
                <Html position={position}>
                  <div
                    className={clsx(
                      "pointer-events-none rounded-md bg-white px-5 py-2 text-left text-itc-green shadow-md",
                      selectedFeatureIds?.includes(country) && "font-bold",
                    )}
                  >
                    {country}
                  </div>
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
