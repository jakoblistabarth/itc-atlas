import * as d3 from "d3";
import { geoPath, GeoSphere } from "d3-geo";
import type { FC } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import themes from "../../lib/styles/themes";
import type { MapTheme } from "../../types/MapTheme";

type Props = {
  data: Topology<{ [name: string]: any }>;
  // object?: string; // TODO: to be Implemented
  projection?: any;
  theme?: MapTheme;
};

const BaseLayer: FC<Props> = ({ data, projection, theme = themes.muted }) => {
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
          <path d={ocean} fill={theme.background.fill} />
        </g>
      )}

      {graticulePath && (
        <g className="graticule">
          <path
            d={graticulePath}
            fill="none"
            stroke={theme.graticule.stroke}
            strokeWidth={theme.graticule.strokeWidth}
            strokeOpacity={theme.graticule.strokeOpacity}
          />
        </g>
      )}

      {landPath && (
        <g className="countries">
          <path d={landPath} fill={theme.base.fill} />
        </g>
      )}

      {bordersPath && (
        <g className="borders">
          <path
            d={bordersPath}
            fill="none"
            stroke={theme.base.stroke}
            strokeLinejoin={theme.base.strokeLineJoin ?? "round"}
            strokeWidth={theme.base.strokeWidth}
          />
        </g>
      )}
    </g>
  );
};

export default BaseLayer;
