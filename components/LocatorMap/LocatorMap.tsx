import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { FC, useId } from "react";
import * as topojson from "topojson-client";
import getMapHeight from "../../lib/helpers/getMapHeight";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../types/MapTheme";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import MapLayerBase from "../MapLayerBase";
import MapLayout from "../MapLayout";
import MarkBbox from "../MarkBbox";
import MarkGeometry from "../MarkGeometry";
import MarkGlyph from "../MarkGlyph";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  highlight?: string[];
  theme?: MapTheme;
  width?: number;
  roundMarkers?: (Omit<React.ComponentProps<typeof MarkGlyph>, "position"> & {
    latitude: number;
    longitude: number;
  })[];
  rectangleMarkers?: Omit<
    React.ComponentProps<typeof MarkBbox>,
    "projection"
  >[];
};

const LocatorMap: FC<Props> = ({
  neCountriesTopoJson,
  highlight,
  roundMarkers,
  rectangleMarkers,
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

  const outlineId = `outline-${useId()}`;
  const shadowMaskId = `shadow-mask-${useId()}`;

  return (
    <MapLayout
      bounds={{ width: dimension.width, height: dimension.height }}
      projection={projection}
    >
      <ellipse
        cx={dimension.width / 2}
        cy={dimension.height - shadowRadius}
        ry={shadowRadius}
        rx={dimension.width * 0.3}
        opacity={0.05}
      />
      <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
      <g>
        {highlightCountries.features.map((feature, idx) => (
          <MarkGeometry
            key={idx}
            feature={feature}
            style={{ ...defaultTheme.choropleth, fill: "lightgray" }}
          />
        ))}
      </g>
      <defs>
        <circle id={outlineId} cx={width / 2} cy={width / 2} r={width / 2} />
        <mask id={shadowMaskId}>
          <use xlinkHref={`#${outlineId}`} fill="white" />
          <use
            transform={`translate(${dimension.width * -0.35}, ${
              dimension.height * -0.5
            }) scale(1.4)`}
            xlinkHref={`#${outlineId}`}
            fill="black"
          />
        </mask>
      </defs>
      <g mask={`url(#${shadowMaskId})`}>
        <use xlinkHref={`#${outlineId}`} fill={"black"} fillOpacity={0.05} />
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
      {roundMarkers &&
        roundMarkers?.map((d, idx) => {
          const p = projection([d.longitude, d.latitude]);
          return p && <MarkGlyph key={`marker-${idx}`} {...d} />;
        })}
      {rectangleMarkers &&
        rectangleMarkers?.map((d, idx) => {
          return <MarkBbox key={`marker-${idx}`} {...d} />;
        })}
    </MapLayout>
  );
};

export default LocatorMap;
