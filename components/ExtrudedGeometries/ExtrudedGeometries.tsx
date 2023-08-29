import React from "react";
import { FC, useMemo } from "react";
import Mark3dGeometry from "../Mark3dGeometry";
import { SVGLoader } from "three-stdlib";
import { ExtrudeGeometryOptions } from "three";
import type { Topology } from "topojson-specification";
import { feature } from "topojson-client";
import {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import { featureCollectionToSVG } from "./ExtrudedGeometries.helpers";
import { geoPath, GeoProjection } from "d3-geo";

const ExtrudedGeometries: FC<{
  topology: Topology;
  topologyObject: string;
  color: string;
  projection: GeoProjection;
  width: number;
  height: number;
  extrudeGeometryOptions?: ExtrudeGeometryOptions;
}> = ({
  topology,
  topologyObject,
  projection,
  width,
  height,
  color,
  extrudeGeometryOptions = {},
}) => {
  projection.fitExtent(
    [
      [-width / 2, -height / 2],
      [width / 2, height / 2],
    ],
    { type: "Sphere" }
  );

  const fc = feature(
    topology,
    topology.objects[topologyObject]
  ) as FeatureCollection<MultiPolygon | Polygon, GeoJsonProperties>;
  const svg = featureCollectionToSVG(fc, geoPath(projection));

  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const { paths } = svgData;
  const shapes = useMemo(
    () =>
      paths.flatMap((p) =>
        p.toShapes(true).map((shape) => ({
          shape,
          color,
          extrudeGeometryOptions,
          fillOpacity: p.userData?.style.fillOpacity,
        }))
      ),
    [paths, color, extrudeGeometryOptions]
  );

  return (
    <group rotation={[Math.PI / -2, 0, 0]}>
      {shapes.map((props) => (
        <Mark3dGeometry key={props.shape.uuid} {...props} />
      ))}
    </group>
  );
};

export default ExtrudedGeometries;