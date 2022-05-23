import * as d3 from "d3";
import { FC } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";
import BaseLayer from "./BaseLayer";
import { MapTheme } from "../../types/MapTheme";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import ChoroplethSymbol from "./ChoroplethSymbol";
import { nanoid } from "nanoid";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

type Props = {
  data: Topology;
  highlight?: string[];
  theme?: MapTheme;
};

const LocatorMap: FC<Props> = ({ data, highlight, theme = defaultTheme }) => {
  const dimension = {
    width: 300,
    height: 0,
  };

  const countries = topojson.feature(
    data,
    data.objects.countries
  ) as FeatureCollection;
  const highlightCountries: FeatureCollection = {
    type: "FeatureCollection",
    features: countries.features.filter((country) => {
      return highlight?.includes(country.properties?.iso3code);
    }),
  };
  const centroid = d3.geoCentroid(highlightCountries);
  const rotation = centroid.map((val) => -val);

  const projection = d3.geoOrthographic().rotate(rotation);
  const shadowRadius = dimension.width / 30;
  dimension.height = getMapHeight(dimension.width, projection, shadowRadius);

  return (
    <>
      <svg width={dimension.width} height={dimension.height}>
        <ellipse
          cx={dimension.width / 2}
          cy={dimension.height - shadowRadius}
          ry={shadowRadius}
          rx={dimension.width * 0.3}
          opacity={0.05}
        />
        <BaseLayer data={data} projection={projection} theme={theme} />
        <g>
          {highlightCountries.features.map((feature) => (
            <ChoroplethSymbol
              key={nanoid()}
              feature={feature}
              projection={projection}
              theme={themes.muted}
            />
          ))}
        </g>
        <defs>
          <mask id="shadow-mask">
            <use xlinkHref="#outline" fill="white"></use>
            <use
              transform={`translate(${dimension.width * -0.35}, ${
                dimension.height * -0.5
              }) scale(1.4)`}
              xlinkHref="#outline"
              fill="black"
            ></use>
          </mask>
        </defs>
        <g mask="url(#shadow-mask)">
          <use xlinkHref="#outline" fill={"black"} fillOpacity={0.05} />
        </g>
        {!highlight?.length && (
          <g>
            <rect
              fill="white"
              fillOpacity={0.8}
              width={dimension.width}
              height={dimension.height}
            ></rect>
            <text
              transform={`translate(${dimension.width / 2}, ${
                dimension.height / 2
              })`}
              textAnchor="middle"
            >
              No focus Country set.
            </text>
          </g>
        )}
      </svg>
    </>
  );
};

export default LocatorMap;
