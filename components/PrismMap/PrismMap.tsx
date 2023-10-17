import { ScaleLinear, ScaleOrdinal, group } from "d3";
import { GeoProjection, geoPath } from "d3-geo";
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import { FC, useMemo } from "react";
import { ExtrudeGeometryOptions } from "three";
import { SVGLoader } from "three-stdlib";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import Mark3dGeometry from "../Mark3dGeometry";
import { featureCollectionToSVG } from "./PrismMap.helpers";

type Props = {
  /** What topojson object should be used fo the map? */
  topology: Topology;
  /** What is the name of the topojson's topology object? */
  topologyObject: string;
  /** Which projection should be used to transform the
   * topology's geographic coordinates to planar coordinates?
   * */
  projection: GeoProjection;
  /** What should be the width of the map?
   * (The projection is scaled according the map's width)
   * */
  width: number;
  /** What should be the length of the map?
   * (The projection is scaled according the map's length)
   * */
  length: number;
  /** Which is the fall back color, used either when no colorScale is defined
   * or the scale returns undefined.
   */
  defaultColor?: string;
  /** What OrdinalScale (D3) should be used to color each feature? */
  colorScale?: ScaleOrdinal<string, string, string>;
  /** Which GeoJson Property should be accessed to get each feature's color? */
  colorPropertyAccessor?: (properties: GeoJsonProperties) => string;
  /** What is the fall extrusion, used either when no extrusionScale is defined
   * or the scale returns undefined.
   */ defaultExtrusion?: number;
  extrusionScale?: ScaleLinear<number, number, number>;
  /** Which GeoJson Property should be accessed to get each feature's extrusion? */
  extrusionPropertyAccessor?: (properties: GeoJsonProperties) => number;
  /** What are additional properties used to for extrusion or color?
   * The map keys need to be ISO3 codes.
   */
  featureProperties?: Map<string, GeoJsonProperties>;
  /** Which options should be used for the extrusion? */
  extrudeGeometryOptions?: ExtrudeGeometryOptions;
};

/**
 * A canvas-rendered 3D component, which renders a topojson as prism map.
 * @returns An three.js group element, containing the map.
 */
const PrismMap: FC<Props> = ({
  topology,
  topologyObject,
  projection,
  width,
  length,
  defaultColor = "lightgrey",
  colorScale,
  colorPropertyAccessor,
  defaultExtrusion = 0.01,
  extrusionScale,
  extrusionPropertyAccessor,
  featureProperties,
  extrudeGeometryOptions = {},
}) => {
  projection.fitExtent(
    [
      [-width / 2, -length / 2],
      [width / 2, length / 2],
    ],
    { type: "Sphere" }
  );

  if (colorScale) colorScale.unknown(defaultColor);
  if (extrusionScale) extrusionScale.unknown(defaultExtrusion);

  const fc = feature(
    topology,
    topology.objects[topologyObject]
  ) as FeatureCollection<MultiPolygon | Polygon, GeoJsonProperties>;
  const fcWithProps = {
    ...fc,
    features: fc.features.map((d) => ({
      ...d,
      properties: {
        ...d.properties,
        ...featureProperties?.get(d.properties?.ADM0_A3_NL),
      },
    })),
  };
  const svg = featureCollectionToSVG(fcWithProps, geoPath(projection));

  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const { paths } = svgData;
  const shapes = useMemo(
    () =>
      group(
        paths.flatMap((p, idx) =>
          p.toShapes(true).map((shape) => {
            const feature = fcWithProps.features[idx];
            const color =
              colorScale && colorPropertyAccessor
                ? colorScale(colorPropertyAccessor(feature.properties))
                : defaultColor;
            return {
              shape,
              color,
              extrudeGeometryOptions: {
                ...extrudeGeometryOptions,
                depth:
                  extrusionScale && extrusionPropertyAccessor
                    ? extrusionScale(
                        extrusionPropertyAccessor(feature.properties)
                      )
                    : defaultExtrusion,
              },
              fillOpacity: p.userData?.style.fillOpacity,
              properties: feature.properties,
            };
          })
        ),
        (d) => d.properties?.ADM0_A3
      ),
    [
      fcWithProps.features,
      paths,
      defaultColor,
      colorScale,
      colorPropertyAccessor,
      defaultExtrusion,
      extrusionScale,
      extrusionPropertyAccessor,
      extrudeGeometryOptions,
    ]
  );

  return (
    <group rotation={[Math.PI / -2, 0, 0]}>
      {Array.from(shapes).map(([country, shapes]) => (
        <group key={country}>
          {shapes.map((d) => (
            <Mark3dGeometry key={d.shape.uuid} {...d} />
          ))}
        </group>
      ))}
    </group>
  );
};

export default PrismMap;
