import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import getCountries from "../../../lib/data/getCountries";
import MapLayerBase from "../../../components/MapLayerBase";
import { geoBertin1953 } from "d3-geo-projection";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import MapLayerFlow from "../../../components/MapLayerFlow";
import MapLayout from "../../../components/MapLayout";
import MapLayoutBody from "../../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../../components/MapLayout/MapLayoutHeader";
import { MapOptions } from "../../../types/MapOptions";
import LegendFlow from "../../../components/LegendFlow";
import MapLayoutAside from "../../../components/MapLayout/MapLayoutAside";
import * as d3 from "d3";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import getOdMatrix from "../../../lib/data/getOdMatrix";

/**
 * @swagger
 * /api/maps/flights:
 *   get:
 *     summary: 2D map on ITC flights of 2019.
 *     description: Returns flights map of ITC staff of 2019, including projects and examinations
 *     tags:
 *        - SVG
 *     parameters:
 *        - in: query
 *          name: theme
 *          example: ETH
 *          deprecated: true
 *          type: string
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
  const themeReq = req.query.theme?.toString() as ThemeNames;
  const theme = !themeReq ? defaultTheme : themes.get(themeReq);
  if (!theme) {
    res.status(400).json({ error: "invalid theme name" });
  }

  const neCountriesTopoJson = getCountries();
  const odMatrix = await getOdMatrix();

  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scale = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 1])
    .range([1, 15]);

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
    projection: geoBertin1953(),
    theme: theme ?? defaultTheme,
    styles: {
      pointStyle: {
        stroke: "none",
        fillOpacity: 1,
      },
    },
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <MapLayout
      bounds={mapOptions.bounds}
      projection={mapOptions.projection}
      theme={theme}
    >
      <MapLayoutHeader>
        <text dominantBaseline={"hanging"} fontSize={"2em"}>
          ITC&apos;s flight activities
        </text>
        <text dominantBaseline={"hanging"} dy={"2em"}>
          by staff for projects and examinations
        </text>
      </MapLayoutHeader>
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <LegendFlow
          data={odMatrix.flows.features.map((flow) => flow.properties?.value)}
          scaleWidth={scale}
          title="No. of flights in 2019"
          unitLabel="flights"
          flowStyle={mapOptions.theme.flow}
        />
      </MapLayoutAside>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <MapLayerBase
          countries={neCountriesTopoJson}
          theme={mapOptions.theme}
        />
        <MapLayerFlow
          data={odMatrix}
          scaleWidth={scale}
          flowStyle={mapOptions.theme.flow}
          pointStyle={mapOptions.styles?.pointStyle}
        />
      </MapLayoutBody>
    </MapLayout>
  );
  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
