import * as d3 from "d3";
import { geoPath, GeoSphere, GeoProjection } from "d3-geo";
import { FC, useId } from "react";
import * as topojson from "topojson-client";
import type {
  MultiPolygon as MultiPolygonT,
  Polygon as PolygonT,
} from "topojson-specification";
import type { MapTheme } from "../../types/MapTheme";
import MapLayerGraticuleLabels from "../MapLayerGraticuleLabels";
import geoCirclesLat from "../../lib/helpers/geoCirclesLat";
import ShadowLayer from "../MapLayerShadow/MapLayerShadow";
import LabelArea from "../LabelArea";
import RadialGradient from "../GradientRadial";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import {
  CountryProperties,
  NeCountriesTopoJson,
  NeLakes,
  NeRivers,
} from "../../types/NeTopoJson";
import MarkGeometry from "../MarkGeometry/MarkGeometry";
import MapLayerGraticule from "../MapLayerGraticule";

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

const MapLayerBase: FC<Props> = ({
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
  ) as FeatureCollection<MultiPolygon | Polygon, CountryProperties>;
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

  const id = useId();
  const outlinePathId = `outline-${id}`;
  const clipId = `clip-${id}`;
  const oceanGradientId = `oceanGradient-${id}`;

  return (
    <>
      {hasShadow && pathSphere && (
        <ShadowLayer
          id={`shadow_${id}`}
          geoPath={pathSphere}
          color={theme.background.fill ?? "black"}
          blur={30}
        />
      )}
      <g
        className="base-map"
        id={`base-map-${id}`}
        clipPath={`url(#${clipId})`}
      >
        {pathSphere && (
          <defs>
            <path id={outlinePathId} d={pathSphere} />
            <clipPath id={clipId}>
              <use xlinkHref={`#${outlinePathId}`} />
            </clipPath>
            {theme.background.gradient && (
              <RadialGradient
                id={`#${oceanGradientId}`}
                colorStops={theme.background.gradient}
              />
            )}
          </defs>
        )}
        {pathSphere && (
          <g className="sphere" id={`sphere-${id}`}>
            <path
              d={pathSphere}
              fill={
                theme.background.gradient
                  ? `url(#${oceanGradientId})`
                  : theme.background.fill
              }
            />
          </g>
        )}

        <MapLayerGraticule projection={projection} />

        {landPath && (
          <g className="landmasses" id={`landmasses-${id}`}>
            <path d={landPath} fill={theme.base.fill} />
          </g>
        )}

        {lakesPath && (
          <g className="lakes" id={`lakes-${id}`}>
            <path d={lakesPath} fill={theme.background.fill} />
          </g>
        )}

        {riversPath && (
          <g className="rivers" id={`rivers-${id}`}>
            <path
              d={riversPath}
              fill={"none"}
              strokeWidth={0.25}
              stroke={theme.background.fill}
            />
          </g>
        )}

        {bordersPath && (
          <g className="borders" id={`borders-${id}`}>
            <path
              d={bordersPath}
              fill="none"
              stroke={theme.base.stroke}
              strokeLinejoin={theme.base.strokeLineJoin ?? "round"}
              strokeWidth={theme.base.strokeWidth}
            />
          </g>
        )}

        <g className="countries" id={`countries-${id}`}>
          {countriesGeoJson &&
            countriesGeoJson.features.map((country, idx) => {
              return (
                <MarkGeometry
                  id={`${country.properties.ADM0_A3_NL}-${id}`}
                  key={`${country.properties.ADM0_A3_NL}-${idx}`}
                  feature={country}
                  projection={projection}
                  fill="none"
                  stroke="whitesmoke"
                />
              );
            })}
        </g>

        {hasGraticuleLabels && (
          <g className="graticules" id={`graticules-${id}`}>
            <MapLayerGraticuleLabels
              id={`graticule-labels-${id}`}
              style={theme.graticuleLabel}
              projection={projection}
              latRange={{ min: -60, max: 60, step: 10 }}
              lonRange={{ min: -180, max: 180, step: 30 }}
            />
            {geoCirclesLat.features.map((circle, idx) => {
              return (
                <LabelArea
                  key={idx}
                  graticuleType="lat"
                  textAnchor={"middle"}
                  degree={circle.properties?.lat}
                  projection={projection}
                  yOffset={7}
                  xOffset={10}
                  style={theme.graticuleLabel}
                >
                  {circle.properties?.name}
                </LabelArea>
              );
            })}
          </g>
        )}

        {labels &&
          countriesGeoJson.features.map((country, idx) => {
            return (
              <LabelArea
                key={`${(country.properties.ADM0_A3_NL, idx)}`}
                graticuleType="lat"
                degree={d3.geoCentroid(country.geometry)[1]}
                textOriginDegree={d3.geoCentroid(country.geometry)[0]}
                textAnchor={"middle"}
                style={theme.label}
                projection={projection}
              >
                {country.properties?.NAME_EN}
              </LabelArea>
            );
          })}
      </g>

      {hasOutline && (
        <use
          xlinkHref={`#${outlinePathId}`}
          stroke={theme.graticule.stroke}
          fill={"none"}
          strokeWidth={theme.graticule.strokeWidth}
          style={theme.label}
        ></use>
      )}
    </>
  );
};

export default MapLayerBase;
