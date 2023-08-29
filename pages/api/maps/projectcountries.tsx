import { scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LegendProportionalCircle from "../../../components/LegendProportionalCircle";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayout from "../../../components/MapLayout";
import MapLayoutAside from "../../../components/MapLayout/MapLayoutAside";
import MapLayoutBody from "../../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../../components/MapLayout/MapLayoutHeader";
import MarkCircle from "../../../components/MarkCircle";
import ChoroplethSymbol from "../../../components/MarkGeometry";
import PatternLine from "../../../components/PatternLine";
import getCountries from "../../../lib/data/getCountries";
import getCountriesByGroup from "../../../lib/data/getCountriesByGroup";
import getProjectsPerCountry from "../../../lib/data/getProjectsPerCountry";
import { setMapBounds } from "../../../lib/helpers/getMapHeight";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";
import { UnGrouping } from "../../../types/UnsdCodes";

/**
 * @swagger
 * /api/maps/projectcountries:
 *   get:
 *     summary: 2D map of projectcountries.
 *     description: Returns 2D map of projectcountries
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
  const [{ data, domain }, highlightCountries] = await Promise.all([
    getProjectsPerCountry(),
    getCountriesByGroup(UnGrouping.LDC),
  ]);

  const scale = scaleSqrt().domain(domain).range([1, 40]);

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
        <LegendProportionalCircle
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
        <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
        <g className="choroplethLayer">
          <defs>
            <PatternLine
              stroke={theme?.choropleth?.pattern?.color}
              name={theme?.choropleth?.pattern?.id}
              angle={20}
            ></PatternLine>
          </defs>
          {highlightCountries.features.map((feature) => (
            <ChoroplethSymbol
              key={feature.properties.ADM0_ISO}
              feature={feature}
              fill={"url(#Lines)"}
            />
          ))}
        </g>
        <g className="symbolLayer">
          {data.features.map(({ properties, geometry }, idx) => {
            return (
              <MarkCircle
                key={idx}
                lng={geometry.coordinates[0]}
                lat={geometry.coordinates[1]}
                radius={scale(properties?.projectCount)}
                {...theme?.symbol}
                interactive={false}
              />
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
