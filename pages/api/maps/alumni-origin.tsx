import { descending, max, scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { Feature, FeatureCollection, Point } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import { feature } from "topojson-client";
import LegendProportionalCircle from "../../../components/LegendProportionalCircle";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayout from "../../../components/MapLayout";
import MapLayoutAside from "../../../components/MapLayout/MapLayoutAside";
import MapLayoutBody from "../../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../../components/MapLayout/MapLayoutHeader";
import MarkCircle from "../../../components/MarkCircle";
import PatternLine from "../../../components/PatternLine";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import getCountries from "../../../lib/data/getCountries";
import getCountryWithApplicantCount from "../../../lib/data/queries/country/getCountryWithApplicantCount";
import { setMapBounds } from "../../../lib/helpers/getMapHeight";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";
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
        <LegendProportionalCircle
          data={data.map((d) => d._count.applicants ?? 0)}
          scaleRadius={scale}
          title={"Alumni per country"}
          unitLabel={"alumni"}
          style={mapOptions.theme?.symbol}
          showFunction={false}
        />
      </MapLayoutAside>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <MapLayerBase
          countries={neCountriesTopoJson}
          theme={mapOptions.theme}
        />
        <g className="choroplethLayer">
          <defs>
            <PatternLine
              stroke={mapOptions.theme?.choropleth?.pattern?.color}
              name={mapOptions.theme?.choropleth?.pattern?.id}
              angle={20}
            ></PatternLine>
          </defs>
        </g>
        <g className="symbolLayer">
          {featureCollection.features.map(({ properties, geometry }, idx) => (
            <MarkCircle
              key={idx}
              longitude={geometry.coordinates[0]}
              latitude={geometry.coordinates[1]}
              radius={scale(properties?.alumniCount)}
              {...mapOptions.theme?.symbol}
              interactive={false}
            />
          ))}
        </g>
      </MapLayoutBody>
    </MapLayout>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
