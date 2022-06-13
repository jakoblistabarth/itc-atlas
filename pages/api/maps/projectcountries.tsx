import { geoBertin1953 } from "d3-geo-projection";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import PatternLines from "../../../components/defs/patterns/PatternLines";
import BaseLayer from "../../../components/map/BaseLayer";
import ChoroplethSymbol from "../../../components/map/ChoroplethSymbol";
import PointSymbol from "../../../components/map/PointSymbol";
import ProportionalSymbolLegend from "../../../components/map/ProportionalSymbolLegend";
import getCountries from "../../../lib/data/getCountries";
import getProjectsByCountry from "../../../lib/data/getProjectsByCountry";
import themes from "../../../lib/styles/themes";
import { scaleSqrt } from "d3";
import getCountriesByCategory from "../../../lib/data/getCountriesByGroup";
import { UnGrouping } from "../../../types/UnsdCodes";
import MapAside from "../../../components/map/layout/MapAside";
import MapBody from "../../../components/map/layout/MapBody";
import MapHeader from "../../../components/map/layout/MapHeader";
import ReactDOMServer from "react-dom/server";
import { MapOptions } from "../../../types/MapOptions";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import Map from "../../../components/map/layout/Map";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const themeReq = req.query.theme?.toString();
  const theme = !themeReq ? defaultTheme : themes[themeReq];
  if (!theme) {
    res.status(500).json({ error: "invalid theme name" });
  }

  const [{ data, domain }, world, highlightCountries] = await Promise.all([
    getProjectsByCountry(),
    getCountries(),
    getCountriesByCategory(UnGrouping.LDC),
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
    theme: theme,
    scales: { scale },
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <Map
      bounds={mapOptions.bounds}
      projection={mapOptions.projection}
      theme={theme}
    >
      <MapHeader
        bounds={mapOptions.bounds}
        title={"ITC's global project activity"}
        subtitle={"over 50 years"}
        theme={theme}
      />
      <MapAside xOffset={0} yOffset={mapOptions.bounds?.frame?.top}>
        <ProportionalSymbolLegend
          key={nanoid()}
          data={data.features.map(
            (feature) => feature.properties?.projectCount ?? 0
          )}
          scaleRadius={scale}
          title={"Projects per country"}
          unitLabel={"project"}
          style={theme.symbol}
        />
      </MapAside>
      <MapBody bounds={mapOptions.bounds}>
        <BaseLayer
          data={world}
          projection={mapOptions.projection}
          theme={theme}
        />
        <g className="choroplethLayer">
          <defs>
            <PatternLines
              style={theme.choropleth?.pattern}
              angle={20}
            ></PatternLines>
          </defs>
          {highlightCountries.features.map((feature) => (
            <ChoroplethSymbol
              key={nanoid()}
              projection={mapOptions.projection}
              feature={feature}
              theme={theme} // TODO: do I really need to add theme and style here?
            />
          ))}
        </g>
        <g className="symbolLayer">
          {data.features.map((feature) => (
            <PointSymbol
              key={nanoid()}
              xy={mapOptions.projection(feature.geometry.coordinates)}
              radius={scale(feature.properties?.projectCount)}
              style={theme.symbol}
            />
          ))}
        </g>
      </MapBody>
    </Map>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
