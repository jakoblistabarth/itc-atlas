import { geoBertin1953 } from "d3-geo-projection";
import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import BtorsByCountryByYear from "../../../components/BtorsByCountryByYear";
import MapLayerBase from "../../../components/MapLayerBase";
import MapLayout from "../../../components/MapLayout";
import MapLayoutBody from "../../../components/MapLayout/MapLayoutBody";
import getCountries from "../../../lib/data/getCountries";
import getBtorsGroupedByYear from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import getCountryCodes from "../../../lib/data/queries/country/getCountryCodes";
import { setMapBounds } from "../../../lib/helpers/getMapHeight";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../../types/MapOptions";

/**
 * @swagger
 * /api/maps/btors-by-country-by-year:
 *   get:
 *     summary: 2D map of BTORs grouped by country and year.
 *     description: Returns a 2D map on BTORs, showing all BTORs as sparkline per country.
 *     tags:
 *        - SVG
 *     responses:
 *       200:
 *         description: response success
 *       400:
 *         description: bad request
 */
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const neCountriesTopoJson = getCountries();
  const countryCodes = await getCountryCodes();
  const btors = await getBtorsGroupedByYear();

  const mapOptions: MapOptions = {
    bounds: {
      width: 900,
      height: 500,
    },
    get projection() {
      return setMapBounds(this.bounds, geoBertin1953());
    },
    theme: defaultTheme,
  };

  const svg = ReactDOMServer.renderToStaticMarkup(
    <MapLayout bounds={mapOptions.bounds} projection={mapOptions.projection}>
      <MapLayoutBody bounds={mapOptions.bounds}>
        <MapLayerBase
          countries={neCountriesTopoJson}
          theme={mapOptions.theme}
        />
        <BtorsByCountryByYear
          {...{ btors, countryCodes, neCountriesTopoJson }}
        />
      </MapLayoutBody>
    </MapLayout>,
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
