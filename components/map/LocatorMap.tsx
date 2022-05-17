import * as d3 from "d3";
import { FC, useState } from "react";
import themes from "../../lib/styles/themes";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { FeatureCollection } from "geojson";
import BaseLayer from "./BaseLayer";
import { MapTheme } from "../../types/MapTheme";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import ChoroplethSymbol from "./ChoroplethSymbol";
import { nanoid } from "nanoid";
import GaussianBlur from "../defs/filter/GaussianBlur";

type Props = {
  data: Topology;
  highlight?: string[];
  theme?: MapTheme;
};

const LocatorMap: FC<Props> = ({ data, highlight, theme = themes.muted }) => {
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
        <defs>
          <GaussianBlur id={"blur"} blur={0} />
        </defs>
        <ellipse
          cx={dimension.width / 2}
          cy={dimension.height - shadowRadius}
          ry={shadowRadius}
          rx={dimension.width * 0.3}
          opacity={0.05}
          filter={`url(#blur)`}
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
