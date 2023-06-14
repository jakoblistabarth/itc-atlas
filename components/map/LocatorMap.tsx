import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { FC } from "react";
import { Vector2 } from "three";
import * as topojson from "topojson-client";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../types/MapTheme";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import BaseLayer from "./BaseLayer";
import PolygonSymbol from "./PolygonSymbol";
import RoundMarker from "./RoundMarker";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  highlight?: string[];
  theme?: MapTheme;
  width?: number;
  markers?: (Omit<React.ComponentProps<typeof RoundMarker>, "position"> & {
    lat: number;
    lng: number;
  })[];
};

const LocatorMap: FC<Props> = ({
  neCountriesTopoJson,
  highlight,
  markers,
  width = 300,
  theme = defaultTheme,
}) => {
  const dimension = {
    width,
    height: 0,
  };

  const countries = topojson.feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries
  );
  const highlightCountries: FeatureCollection = {
    type: "FeatureCollection",
    features: countries.features.filter((country) => {
      return highlight?.includes(country.properties?.ADM0_A3_NL);
    }),
  };
  const centroid = d3.geoCentroid(highlightCountries);
  const rotation: [number, number] = [-centroid[0], -centroid[1]];

  const projection = d3.geoOrthographic().rotate(rotation);
  const shadowRadius = dimension.width / 30;
  dimension.height = getMapHeight(dimension.width, projection, {
    marginBottom: shadowRadius,
  });

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
        <BaseLayer
          countries={neCountriesTopoJson}
          projection={projection}
          theme={theme}
        />
        <g>
          {highlightCountries.features.map((feature, idx) => (
            <PolygonSymbol
              key={idx}
              feature={feature}
              projection={projection}
              style={{ ...defaultTheme.choropleth, stroke: "black" }}
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
        {markers &&
          markers?.map((d, idx) => {
            const p = projection([d.lng, d.lat]);
            return (
              p && (
                <RoundMarker
                  key={`marker-${idx}`}
                  position={new Vector2(p[0], p[1])}
                  {...d}
                />
              )
            );
          })}
      </svg>
    </>
  );
};

export default LocatorMap;
