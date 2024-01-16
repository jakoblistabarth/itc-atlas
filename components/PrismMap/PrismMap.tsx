import { ScaleLinear, ScaleOrdinal, ScaleQuantile } from "d3";
import { GeoProjection, geoPath } from "d3-geo";
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import { FC, memo, useMemo } from "react";
import { ExtrudeGeometryOptions } from "three";
import { SVGLoader } from "three-stdlib";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { FeatureIdentifier } from "../../types/FeatureIdentifier";
import { MemoizedMark3dGeometry } from "../Mark3dGeometry";
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
  colorScale?:
    | ScaleOrdinal<string, string, string>
    | ScaleQuantile<string, string>;
  /** Which GeoJson Property should be accessed to get each feature's color? */
  colorPropertyAccessor?: (properties: GeoJsonProperties) => string | number;
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
  /** What action should be triggered if the user moves the pointer onto one of the PrismMap's festures? */
  onFeaturePointerEnterHandler?: (featureIdentifier: FeatureIdentifier) => void;
  /** What action should be triggered if the user moves the pointer out of one of the PrismMap's festures? */
  onFeaturePointerLeaveHandler?: () => void;
  /** What action should be triggered if the user clicks on one of the PrismMap's festures? */
  onFeaturePointerDownHandler?: (featureIdentifier: FeatureIdentifier) => void;
  /** Which features should be selected?
   * An array of feature ids.
   */
  selectedFeatures?: FeatureIdentifier[];
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
  selectedFeatures,
  onFeaturePointerEnterHandler,
  onFeaturePointerLeaveHandler,
  onFeaturePointerDownHandler,
  extrudeGeometryOptions = {},
}) => {
  projection.fitExtent(
    [
      [-width / 2, -length / 2],
      [width / 2, length / 2],
    ],
    { type: "Sphere" },
  );

  //@ts-expect-error scaleQuantize does not have unknown()
  if (colorScale) colorScale.unknown(defaultColor);
  if (extrusionScale) extrusionScale.unknown(defaultExtrusion);

  const fc = feature(
    topology,
    topology.objects[topologyObject],
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
      paths.map((p, idx) => {
        const feature = fcWithProps.features[idx];
        const color =
          colorScale && colorPropertyAccessor
            ? //@ts-expect-error scaleQuantize expects number, scaleOrdinal a string
              colorScale(colorPropertyAccessor(feature.properties))
            : defaultColor;
        const shapes = p.toShapes(true);
        return {
          id: feature.properties.ADM0_A3 as string,
          shape: shapes,
          color,
          fillOpacity: p.userData?.style.fillOpacity,
          properties: feature.properties,
          extrudeGeometryOptions: {
            ...extrudeGeometryOptions,
            depth:
              extrusionScale && extrusionPropertyAccessor
                ? extrusionScale(extrusionPropertyAccessor(feature.properties))
                : defaultExtrusion,
          },
        };
      }),
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
    ],
  );

  return (
    <group rotation={[Math.PI / -2, 0, 0]}>
      {shapes.map((d) => (
        <group key={d.id}>
          <MemoizedMark3dGeometry
            {...d}
            onPointerDownHandler={() =>
              onFeaturePointerDownHandler &&
              onFeaturePointerDownHandler({
                id: d.id,
                label: d.properties.NAME_EN,
              })
            }
            onPointerEnterHandler={() =>
              onFeaturePointerEnterHandler &&
              onFeaturePointerEnterHandler({
                id: d.id,
                label: d.properties.NAME_EN,
              })
            }
            onPointerLeaveHandler={() =>
              onFeaturePointerLeaveHandler && onFeaturePointerLeaveHandler()
            }
            isActive={selectedFeatures?.map(({ id }) => id).includes(d.id)}
          />
        </group>
      ))}
    </group>
  );
};

export default PrismMap;

export const MemoizedPrismMap = memo(PrismMap);
