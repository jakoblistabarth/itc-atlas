import * as d3 from "d3";
import { geoPath, GeoSphere, GeoProjection } from "d3-geo";
import type { FC } from "react";
import * as topojson from "topojson-client";
import type {
  MultiPolygon as MultiPolygonT,
  Polygon as PolygonT,
} from "topojson-specification";
import type { MapTheme } from "../../types/MapTheme";
import GraticuleLabelLayer from "./GraticuleLabelLayer";
import geoEquator from "../../lib/cartographic/geoEquator";
import geoCirclesLat from "../../lib/cartographic/geoCirclesLat";
import ShadowLayer from "./ShadowLayer";
import BendedLabel from "./BendedLabel";
import { nanoid } from "nanoid";
import RadialGradient from "../defs/RadialGradient";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import getLakes from "../../lib/data/getLakes";
import getRivers from "../../lib/data/getRivers";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import {
  CountryProperties,
  NeCountriesTopoJson,
} from "../../types/NeCountriesTopoJson";

type Props = {
  data: NeCountriesTopoJson;
  projection: GeoProjection;
  theme?: MapTheme;
  labels?: boolean;
  drawLakes?: boolean;
  drawRivers?: boolean;
  drawOutline?: boolean;
  drawGraticuleLabels?: boolean;
  drawShadow?: boolean;
};

const BaseLayer: FC<Props> = ({
  data,
  projection,
  theme = defaultTheme,
  labels = false,
  drawLakes,
  drawRivers,
  drawOutline,
  drawGraticuleLabels,
  drawShadow,
}) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" };
  const pathSphere = path(sphere);
  const graticule = d3.geoGraticule10();
  const graticulePath = path(graticule);
  const equatorPath = path(geoEquator);
  const circlesPath = path(geoCirclesLat);
  const land = topojson.merge(
    data,
    data.objects.countries.geometries as Array<
      MultiPolygonT<CountryProperties> | PolygonT<CountryProperties>
    >
  ); //Question: is there a way to avoid this, set geometry type in type definition?
  const landPath = path(land);
  const countries = topojson.feature(
    data,
    data.objects.countries
  ) as FeatureCollection<MultiPolygon | Polygon>;
  const borders = topojson.mesh(
    data,
    data.objects.countries,
    (a, b) => a !== b
  );
  const bordersPath = path(borders);
  const lakes = getLakes();
  const lakesGeoJSON = topojson.feature(
    lakes,
    lakes.objects.ne_lakes
  ) as FeatureCollection<MultiPolygon | Polygon>;
  const lakesPath = path(lakesGeoJSON);
  const rivers = getRivers();
  const riversGeoJSON = topojson.feature(
    rivers,
    rivers.objects.ne_rivers_lake_centerlines
  );
  const riversPath = path(riversGeoJSON);

  const hasGraticuleLabels =
    drawGraticuleLabels ?? theme.hasGraticuleLables ?? false;
  const hasOutline = drawOutline ?? theme.hasOutline ?? false;
  const hasShadow = drawShadow ?? theme.hasShadow ?? false;
  const hasLakes = drawLakes ?? theme.hasLakes ?? true;
  const hasRivers = drawRivers ?? theme.hasRivers ?? true;

  return (
    <>
      {hasShadow && pathSphere && (
        <ShadowLayer
          geoPath={pathSphere}
          color={theme.background.fill ?? "black"}
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

        {circlesPath && (
          <path
            d={circlesPath}
            fill={"none"}
            stroke={theme.graticule.stroke}
            strokeDasharray="4, 2, 1, 2"
            strokeWidth={(theme.graticule.strokeWidth ?? 0.5) * 2}
          />
        )}

        {landPath && (
          <g className="countries">
            <path d={landPath} fill={theme.base.fill} />
          </g>
        )}

        {hasLakes && lakesPath && (
          <g className="lakes">
            <path d={lakesPath} fill={theme.background.fill} />
          </g>
        )}

        {hasRivers && riversPath && (
          <g className="rivers">
            <path
              d={riversPath}
              fill={"none"}
              strokeWidth={0.25}
              stroke={theme.background.fill}
            />
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
          <>
            <GraticuleLabelLayer
              style={theme.graticuleLabel}
              projection={projection}
              latRange={{ min: -60, max: 60, step: 10 }}
              lonRange={{ min: -180, max: 180, step: 30 }}
            />
            {geoCirclesLat.features.map((circle) => {
              return (
                <BendedLabel
                  key={nanoid()}
                  graticuleType="lat"
                  textAnchor={"middle"}
                  degree={circle.properties?.lat}
                  projection={projection}
                  yOffset={7}
                  xOffset={10}
                  style={theme.graticuleLabel}
                >
                  {circle.properties?.name}
                </BendedLabel>
              );
            })}
          </>
        )}

        {labels &&
          countries.features.map((country) => {
            const [textOriginDegree, degree] = d3.geoCentroid(country.geometry);
            return (
              <BendedLabel
                key={nanoid()}
                graticuleType="lat"
                degree={d3.geoCentroid(country.geometry)[1]}
                textOriginDegree={d3.geoCentroid(country.geometry)[0]}
                textAnchor={"middle"}
                style={theme.label}
                projection={projection}
              >
                {country.properties?.name}
              </BendedLabel>
            );
          })}
      </g>

      {hasOutline && (
        <use
          xlinkHref="#outline"
          stroke={theme.graticule.stroke}
          fill={"none"}
          strokeWidth={theme.graticule.strokeWidth}
          style={theme.label}
        ></use>
      )}
    </>
  );
};

export default BaseLayer;
