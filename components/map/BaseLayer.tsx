import * as d3 from "d3";
import { GeoGeometryObjects, geoPath, GeoSphere } from "d3-geo";
import type { FC } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { color } from "../../lib/cartographic/colors";

type Props = {
  data: Topology<{ [name: string]: any }>;
  // object?: string; // TODO: to be Implemented
  projection?: any;
};

const BaseLayer: FC<Props> = ({ data, projection }) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" }; // Question: okay to do so?
  const ocean = path(sphere);
  const graticule = d3.geoGraticule10();
  const graticulePath = path(graticule);
  const land = topojson.merge(data, data.objects.countries.geometries);
  const landPath = path(land);
  const borders = topojson.mesh(
    data,
    data.objects.countries,
    (a, b) => a !== b
  );
  const bordersPath = path(borders);

  return (
    <g className="base-map">
      {ocean && (
        <g className="oceans">
          <path d={ocean} fill={color.background} />
        </g>
      )}

      {graticulePath && (
        <g className="graticule">
          <path
            d={graticulePath}
            fill="none"
            stroke={color.graticule}
            strokeWidth={0.5}
            strokeOpacity={0.25}
          />
        </g>
      )}

      {landPath && (
        <g className="countries">
          <path d={landPath} fill="white" />
        </g>
      )}

      {bordersPath && (
        <g className="borders">
          <path
            d={bordersPath}
            fill="none"
            stroke={color.background}
            strokeLinejoin="round"
            strokeWidth={1}
          />
        </g>
      )}
    </g>
  );
};

export default BaseLayer;
