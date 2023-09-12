import * as d3 from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayout from "../../../components/MapLayout";
import MapLayoutAside from "../../../components/MapLayout/MapLayoutAside";
import MapLayoutBody from "../../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../../components/MapLayout/MapLayoutHeader";
import LegendNominal from "../../../components/LegendNominal";
import MarkScaledPie from "../../../components/MarkScaledPieChart";
import { setMapBounds } from "../../../lib/helpers/getMapHeight";
import getCountries from "../../../lib/data/getCountries";
import getPhdsByCountryByDepartment from "../../../lib/data/queries/phd/getPhdsByCountryByDepartment";
import { departmentColorScale } from "../../../lib/styles/departmentColorScale";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";

/**
 * @swagger
 * /api/maps/departments:
 *   get:
 *     summary: 2D map on PhD's country of origin per departments.
 *     description: Returns a 2D proportional symbol map showing the country of origin for all PhD's grouped by departments.
 *     tags:
 *        - SVG
 *     parameters:
 *        - in: query
 *          name: theme
 *          type: string
 *          example: ETH
 *          deprecated: true
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
  const data = await getPhdsByCountryByDepartment();

  const min = d3.min(data.map((d) => d.totalCount)) ?? 0;
  const max = d3.max(data.map((d) => d.totalCount)) ?? 1;
  const scale = d3.scaleSqrt().domain([min, max]).range([2, 50]);

  const legendEntries = departmentColorScale.domain().map((d) => ({
    label: d,
    color: departmentColorScale(d),
  }));

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
      return setMapBounds(this.bounds, geoInterruptedMollweide());
    },
    theme: theme ?? defaultTheme,
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <MapLayout
      bounds={mapOptions.bounds}
      projection={mapOptions.projection}
      theme={theme}
    >
      <MapLayoutHeader
        bounds={mapOptions.bounds}
        title={"PhDs"}
        subtitle={"by ITC department"}
        theme={theme}
      />
      <MapLayoutBody bounds={mapOptions.bounds}>
        <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
        <g id="symbols">
          {data.map((d) => {
            return (
              <MarkScaledPie
                key={d.isoAlpha3}
                longitude={d.coordinates[0]}
                latitude={d.coordinates[1]}
                radius={scale(d.totalCount)}
                colorScale={departmentColorScale}
                data={d.departments}
                stroke="lightgrey"
              />
            );
          })}
        </g>
      </MapLayoutBody>
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <LegendNominal title={"Departments"} entries={legendEntries} />
        <g transform={`translate(0,120)`}>
          <LegendNominal
            title={"Top 5 PhD countries"}
            entries={data.slice(0, 5).map((d) => ({
              label: `${d.countryName} (${d.totalCount})`,
              color: "none",
              symbol: <g></g>,
            }))}
          />
        </g>
      </MapLayoutAside>
    </MapLayout>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
