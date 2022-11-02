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
import geoCirclesLat from "../../lib/cartographic/geoCirclesLat";
import ShadowLayer from "./ShadowLayer";
import BendedLabel from "./BendedLabel";
import { nanoid } from "nanoid";
import RadialGradient from "../defs/RadialGradient";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import {
  CountryProperties,
  NeCountriesTopoJson,
  NeLakes,
  NeRivers,
} from "../../types/NeTopoJson";
import PolygonSymbol from "./PolygonSymbol";
import Graticules from "./Graticules";

type Props = {
  countries: NeCountriesTopoJson;
  lakes?: NeLakes;
  rivers?: NeRivers;
  projection: GeoProjection;
  theme?: MapTheme;
  labels?: boolean;
  drawOutline?: boolean;
  drawGraticuleLabels?: boolean;
  drawShadow?: boolean;
};

const BaseLayer: FC<Props> = ({
  countries,
  lakes,
  rivers,
  projection,
  theme = defaultTheme,
  labels = false,
  drawOutline,
  drawGraticuleLabels,
  drawShadow,
}) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" };
  const pathSphere = path(sphere);
  const land = topojson.merge(
    countries,
    countries.objects.ne_admin_0_countries.geometries as Array<
      MultiPolygonT<CountryProperties> | PolygonT<CountryProperties>
    >
  ); //Question: is there a way to avoid this, set geometry type in type definition?
  const landPath = path(land);
  const countriesGeoJson = topojson.feature(
    countries,
    countries.objects.ne_admin_0_countries
  ) as FeatureCollection<MultiPolygon | Polygon>;
  const borders = topojson.mesh(
    countries,
    countries.objects.ne_admin_0_countries,
    (a, b) => a !== b
  );
  const bordersPath = path(borders);
  const lakesGeoJSON = lakes
    ? (topojson.feature(lakes, lakes.objects.ne_lakes) as FeatureCollection<
        MultiPolygon | Polygon
      >)
    : undefined;
  const lakesPath = lakesGeoJSON ? path(lakesGeoJSON) : undefined;
  const riversGeoJSON = rivers
    ? topojson.feature(rivers, rivers.objects.ne_rivers_lake_centerlines)
    : undefined;
  const riversPath = riversGeoJSON ? path(riversGeoJSON) : undefined;

  const hasGraticuleLabels =
    drawGraticuleLabels ?? theme.hasGraticuleLables ?? false;
  const hasOutline = drawOutline ?? theme.hasOutline ?? false;
  const hasShadow = drawShadow ?? theme.hasShadow ?? false;

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

        <Graticules projection={projection} />

        {landPath && (
          <g className="countries">
            <path d={landPath} fill={theme.base.fill} />
          </g>
        )}

        {lakesPath && (
          <g className="lakes">
            <path d={lakesPath} fill={theme.background.fill} />
          </g>
        )}

        {riversPath && (
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

        {countriesGeoJson &&
          countriesGeoJson.features.map((country) => {
            return (
              <PolygonSymbol
                key={nanoid()}
                feature={country}
                projection={projection}
                style={{ ...theme.base, fill: "rgba(255,255,255,0)" }}
              />
            );
          })}

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
          countriesGeoJson.features.map((country) => {
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
