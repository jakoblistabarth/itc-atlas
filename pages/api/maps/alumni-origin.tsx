import { descending, max, scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import { Vector2 } from "three";
import PatternLines from "../../../components/defs/patterns/PatternLines";
import BaseLayer from "../../../components/map/BaseLayer";
import PointSymbol from "../../../components/map/PointSymbol";
import ProportionalCircleLegend from "../../../components/map/ProportionalCircleLegend";
import MapLayout from "../../../components/map/layout/MapLayout";
import MapLayoutAside from "../../../components/map/layout/MapLayoutAside";
import MapLayoutBody from "../../../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../../../components/map/layout/MapLayoutHeader";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";
import getCountries from "../../../lib/data/getCountries";
import getCountryWithApplicantCount from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";
import { feature } from "topojson-client";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { Feature, Point, FeatureCollection } from "geojson";
import { CountryProperties } from "../../../types/NeTopoJson";

/**
 * @swagger
 * /api/maps/alumni-origin:
 *   get:
 *     summary: 2D map of alumni and their origin.
 *     description: Returns a 2D map on alumni and their origin on country level.
 *     tags:
 *        - SVG
 *     parameters:
 *        - in: query
 *          name: level
 *          type: string
 *          example: MSC
 *     responses:
 *       200:
 *         description: response success
 *       400:
 *         description: bad request
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const level = req.query.level?.toString();

  const neCountriesTopoJson = getCountries();
  const countries = feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries
  );
  const data = await getCountryWithApplicantCount(level);

  const domain = [0, max(data.map((d) => d._count.applicants)) ?? 1];
  const scale = scaleSqrt().domain(domain).range([1, 40]);

  type CountryPropertiesWithAlumniCount = CountryProperties & {
    alumniCount: number;
  };

  const featureCollection: FeatureCollection<
    Point,
    CountryPropertiesWithAlumniCount
  > = {
    type: "FeatureCollection",
    features: countries.features
      .map((country) => {
        const isoCode = country.properties?.ADM0_A3_NL;
        const pos = getCentroidByIsoCode(isoCode);
        const feature: Feature<Point, CountryPropertiesWithAlumniCount> = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [pos?.x ?? 0, pos?.y ?? 0],
          },
          properties: {
            ...country.properties,
            alumniCount:
              data.find((d) => d.isoAlpha3 === isoCode)?._count.applicants ?? 0,
          },
        };
        return feature;
      })
      .filter(
        (feature: Feature): feature is Feature =>
          !!feature.properties?.alumniCount
      ) //TODO: replace by filter > 0
      .sort((a: Feature, b: Feature) =>
        descending(a.properties?.alumniCount, b.properties?.alumniCount)
      ),
  };

  const mapOptions: MapOptions = {
    bounds: {
      width: 900,
      height: 500,
      frame: {
        top: 70,
        bottom: 0,
        left: 150,
        right: 0,
      },
    },
    get projection() {
      return setMapBounds(this.bounds, geoBertin1953());
    },
    theme: defaultTheme,
    scales: { scale },
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <MapLayout
      bounds={mapOptions.bounds}
      projection={mapOptions.projection}
      theme={mapOptions.theme}
    >
      <MapLayoutHeader
        bounds={mapOptions.bounds}
        title={"ITC's alumni"}
        theme={mapOptions.theme}
      />
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <ProportionalCircleLegend
          data={data.map((d) => d._count.applicants ?? 0)}
          scaleRadius={scale}
          title={"Alumni per country"}
          unitLabel={"alumni"}
          style={mapOptions.theme?.symbol}
          showFunction={false}
        />
      </MapLayoutAside>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <BaseLayer
          countries={neCountriesTopoJson}
          projection={mapOptions.projection}
          theme={mapOptions.theme}
        />
        <g className="choroplethLayer">
          <defs>
            <PatternLines
              stroke={mapOptions.theme?.choropleth?.pattern?.color}
              name={mapOptions.theme?.choropleth?.pattern?.id}
              angle={20}
            ></PatternLines>
          </defs>
        </g>
        <g className="symbolLayer">
          {featureCollection.features.map((feature, idx) => {
            const xy = mapOptions.projection(
              feature.geometry.coordinates as [number, number]
            );
            return (
              xy && (
                <PointSymbol
                  key={idx}
                  position={new Vector2(xy[0], xy[1])}
                  radius={scale(feature.properties?.alumniCount)}
                  {...mapOptions.theme?.symbol}
                  interactive={false}
                />
              )
            );
          })}
        </g>
      </MapLayoutBody>
    </MapLayout>
  );

  res
    .status(200)
    .setHeader("Content-Type", "image/svg+xml; charset=utf-8;")
    .send(svg);
}
