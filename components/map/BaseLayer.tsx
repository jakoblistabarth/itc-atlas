import * as d3 from "d3";
import { geoPath, GeoSphere } from "d3-geo";
import { FC } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { color } from "../../lib/cartographic/colors";

type Props = {
  data: Topology;
  object?: string; // TODO: to be Implemented
  projection?: any;
};

const BaseLayer: FC<Props> = ({ data, projection }) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" }; // Question: okay to do so?
  const graticule = d3.geoGraticule10();
  const borders = topojson.mesh(
    data,
    data.objects.countries,
    (a, b) => a !== b
  );

  return (
    <g className="base-map">
      <g className="oceans">
        <path d={path(sphere)} fill={color.background} />
      </g>

      <g className="graticule">
        <path
          d={path(graticule)}
          fill="none"
          stroke={color.graticule}
          strokeWidth={0.5}
          strokeOpacity={0.25}
        />
      </g>

      <g className="countries">
        <path
          d={path(topojson.merge(data, data.objects.countries.geometries))}
          fill="white"
        />
      </g>

      <g className="borders">
        <path
          d={path(borders)}
          fill="none"
          stroke={color.background}
          strokeLinejoin="round"
          strokeWidth={1}
        />
      </g>
    </g>
  );
};

export default BaseLayer;
