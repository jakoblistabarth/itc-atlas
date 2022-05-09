import * as d3 from "d3";
import { geoPath, GeoSphere, GeoProjection } from "d3-geo";
import type { FC } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import themes from "../../lib/styles/themes";
import type { MapTheme } from "../../types/MapTheme";
import GraticuleLabelLayer from "./GraticuleLabelLayer";
import geoEquator from "../../lib/cartographic/geoEquator";

type Props = {
  data: Topology<{ [name: string]: any }>;
  // object?: string; // TODO: to be Implemented
  projection: GeoProjection;
  theme?: MapTheme;
};

const BaseLayer: FC<Props> = ({ data, projection, theme = themes.muted }) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" };
  const pathSphere = path(sphere);
  const graticule = d3.geoGraticule10();
  const graticulePath = path(graticule);
  const equatorPath = path(geoEquator);
  const land = topojson.merge(data, data.objects.countries.geometries);
  const landPath = path(land);
  const borders = topojson.mesh(
    data,
    data.objects.countries,
    (a, b) => a !== b
  );
  const bordersPath = path(borders);

  const hasGraticuleLabels = theme.hasGraticuleLables ?? false;
  const hasOutline = theme.hasOutline ?? false;
  const hasShadow = theme.hasShadow ?? true;

  return (
    <>
      {hasShadow && (
        <ShadowLayer
          geoPath={pathSphere}
          color={theme.background.fill}
          blur={30}
        />
      )}
      <g className="base-map" clipPath="url(#clip)">
        {pathSphere && (
          <defs>
            <path id="outline" d={pathSphere} />
            <clipPath id="clip">
              <use xlinkHref="#outline" />
            </clipPath>
            {theme.background.gradient && (
              <RadialGradient
                id={"oceanGradient"}
                colorStops={theme.background.gradient}
              />
            )}
          </defs>
        )}
        {pathSphere && (
          <path
            d={pathSphere}
            fill={
              theme.background.gradient
                ? "url(#oceanGradient)"
                : theme.background.fill
            }
          />
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
            {equatorPath && (
              <path
                d={equatorPath}
                fill={"none"}
                stroke={theme.graticule.stroke}
                strokeWidth={(theme.graticule.strokeWidth ?? 0.5) * 2}
              />
            )}
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

        {hasGraticuleLabels && (
          <GraticuleLabelLayer
            style={theme.graticuleLabel}
            projection={projection}
            latRange={{ min: -60, max: 60, step: 10 }}
            lonRange={{ min: -180, max: 180, step: 30 }}
          />
        )}
      </g>
      {hasOutline && (
        <use
          xlinkHref="#outline"
          stroke={theme.graticule.stroke}
          fill={"none"}
          strokeWidth={theme.graticule.strokeWidth}
        ></use>
      )}
    </>
  );
};

export default BaseLayer;
