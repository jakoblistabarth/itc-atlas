import * as d3 from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import { Vector2 } from "three";
import BaseLayer from "../../../components/map/BaseLayer";
import MapLayout from "../../../components/map/layout/MapLayout";
import MapLayoutAside from "../../../components/map/layout/MapLayoutAside";
import MapLayoutBody from "../../../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../../../components/map/layout/MapLayoutHeader";
import NominalLegend from "../../../components/map/NominalLegend";
import ScaledPie from "../../../components/map/ScaledPie";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";
import getCountries from "../../../lib/data/getCountries";
import getPhdCandidatesByCountryByDepartment from "../../../lib/data/queries/phdCandidate/getPhdCandidatesByCountryByDepartment";
import { departmentColorScale } from "../../../lib/styles/departmentColorScale";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";

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
  const data = await getPhdCandidatesByCountryByDepartment();

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
        title={"PhD candidates"}
        subtitle={"by ITC department"}
        theme={theme}
      />
      <MapLayoutBody bounds={mapOptions.bounds}>
        <BaseLayer
          countries={neCountriesTopoJson}
          projection={mapOptions.projection}
          theme={theme}
        />
        <g id="symbols">
          {data.map((d) => {
            const projection = mapOptions.projection;
            const xy = projection(d.coordinates as [number, number]);
            const position = xy ? new Vector2(xy[0], xy[1]) : new Vector2();
            return (
              <ScaledPie
                key={nanoid()}
                position={position}
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
        <NominalLegend title={"Departments"} entries={legendEntries} />
        <g transform={`translate(0,120)`}>
          <NominalLegend
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
