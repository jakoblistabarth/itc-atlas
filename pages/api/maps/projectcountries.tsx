import { geoBertin1953 } from "d3-geo-projection";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import PatternLines from "../../../components/defs/patterns/PatternLines";
import BaseLayer from "../../../components/map/BaseLayer";
import ChoroplethSymbol from "../../../components/map/PolygonSymbol";
import PointSymbol from "../../../components/map/PointSymbol";
import ProportionalSymbolLegend from "../../../components/map/ProportionalSymbolLegend";
import getCountries from "../../../lib/data/getCountries";
import getProjectsPerCountry from "../../../lib/data/getProjectsPerCountry";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import { scaleSqrt } from "d3";
import getCountriesByGroup from "../../../lib/data/getCountriesByGroup";
import { UnGrouping } from "../../../types/UnsdCodes";
import MapLayoutAside from "../../../components/map/layout/MapLayoutAside";
import MapLayoutBody from "../../../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../../../components/map/layout/MapLayoutHeader";
import ReactDOMServer from "react-dom/server";
import { MapOptions } from "../../../types/MapOptions";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import MapLayout from "../../../components/map/layout/MapLayout";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";

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
  const [{ data, domain }, highlightCountries] = await Promise.all([
    getProjectsPerCountry(),
    getCountriesByGroup(UnGrouping.LDC),
  ]);

  const scale = scaleSqrt().domain(domain).range([2, 40]);

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
        title={"ITC's global project activity"}
        subtitle={"over 50 years"}
        theme={theme}
      />
      <MapLayoutAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <ProportionalSymbolLegend
          key={nanoid()}
          data={data.features.map(
            (feature) => feature.properties?.projectCount ?? 0
          )}
          scaleRadius={scale}
          title={"Projects per country"}
          unitLabel={"project"}
          style={theme?.symbol}
        />
      </MapLayoutAside>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <BaseLayer
          countries={neCountriesTopoJson}
          projection={mapOptions.projection}
          theme={theme}
        />
        <g className="choroplethLayer">
          <defs>
            <PatternLines
              style={theme?.choropleth?.pattern}
              angle={20}
            ></PatternLines>
          </defs>
          {highlightCountries.features.map((feature) => (
            <ChoroplethSymbol
              key={nanoid()}
              projection={mapOptions.projection}
              feature={feature}
            />
          ))}
        </g>
        <g className="symbolLayer">
          {data.features.map((feature) => {
            const xy = mapOptions.projection(
              feature.geometry.coordinates as [number, number]
            );
            return (
              xy && (
                <PointSymbol
                  key={nanoid()}
                  xy={xy}
                  radius={scale(feature.properties?.projectCount)}
                  style={theme?.symbol}
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
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
