import * as d3 from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { Feature, Point } from "geojson";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import BaseLayer from "../../../components/map/BaseLayer";
import MapLayout from "../../../components/map/layout/MapLayout";
import MapLayoutAside from "../../../components/map/layout/MapLayoutAside";
import MapLayoutBody from "../../../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../../../components/map/layout/MapLayoutHeader";
import LegendTitle from "../../../components/map/LegendTitle";
import NominalLegend from "../../../components/map/NominalLegend";
import ScaledPie from "../../../components/map/ScaledPie";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";
import getCountries from "../../../lib/data/getCountries";
import getPhdCandidatesByCountryByDepartment from "../../../lib/data/getPhdCandidatesByCountryByDepartment";
import { departmentColors } from "../../../lib/mappings/departments";
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
    res.status(500).json({ error: "invalid theme name" });
  }
  const neCountriesTopoJson = getCountries();
  const [{ data, domain, legendEntries }] = await Promise.all([
    getPhdCandidatesByCountryByDepartment(),
  ]);

  const scale = d3.scaleSqrt().domain(domain).range([1, 75]);

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
    scales: { scale },
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
          {data.features.map((feature: Feature<Point>) => {
            if (!feature.properties?.departments) return;
            const projection = mapOptions.projection;
            const xy = projection(
              feature.geometry.coordinates as [number, number]
            );
            return (
              xy && (
                <ScaledPie
                  key={nanoid()}
                  xy={xy}
                  scale={scale}
                  colorScheme={Object.values(departmentColors)}
                  pieSize={feature.properties?.totalPhdCount}
                  data={feature.properties?.departments}
                  style={theme?.scaledPie}
                />
              )
            );
          })}
        </g>
      </MapLayoutBody>
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <LegendTitle>Top 5 PhD countries</LegendTitle>
        {data.features.slice(0, 5).map((feature, index) => (
          <g
            fontSize={10}
            transform={`translate(0, ${40 + index * 15})`}
            key={nanoid()}
          >
            <text>
              {feature.properties?.NAME_EN}
              <tspan> ({feature.properties?.totalPhdCount})</tspan>
            </text>
          </g>
        ))}
        <g transform={`translate(0,${mapOptions.bounds.height ?? 0 * 0.25})`}>
          <NominalLegend title={"Departments"} entries={legendEntries} />
        </g>
      </MapLayoutAside>
    </MapLayout>
  );
  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
