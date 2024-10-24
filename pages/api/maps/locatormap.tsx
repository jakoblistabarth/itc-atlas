import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/LocatorMap";
import getCountries from "../../../lib/data/getCountries";
import themes, { ThemeNames } from "../../../lib/styles/themes";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";

/**
 * @swagger
 * /api/maps/locatormap:
 *   get:
 *     summary: 2D Locatormap, with focus.
 *     description: Returns a 2D locator map of the focused country as a `SVG`.
 *     tags:
 *        - SVG
 *     parameters:
 *        - in: query
 *          name: width
 *          description: The width of the `SVG`.
 *          schema:
 *            type: integer
 *          example: 400
 *          default: 300
 *        - in: query
 *          name: country
 *          description: The country to highlight in the locator map.
 *          required: true
 *          schema:
 *            type: string
 *          example: "NLD"
 *        - in: query
 *          name: bounds
 *          description: The bounds of a rectangular area to highlight on the locator map.
 *          schema:
 *            type: string
 *          example: "-3,60,3,50"
 *        - in: query
 *          name: theme
 *          example: ETH
 *          description: The theme of the map.
 *          deprecated: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const width = req.query.width ? Number(req.query.width) : undefined;
  if (Number.isNaN(width)) {
    return res.status(400).json({ error: "invalid width parameter" });
  }
  const highlightCountries = req.query.country;
  const theme = themes.get(req.query.theme?.toString() as ThemeNames);
  const [minLng, maxLat, maxLng, minLat] =
    req.query.bounds?.toString().split(",").map(Number) ?? [];
  if (!highlightCountries) {
    return res.status(400).json({ error: "invalid iso-3-code name" });
  }
  if (
    minLng < -180.0 &&
    maxLat > 90.0 &&
    maxLng > 180.0 &&
    minLat < -90.0 &&
    minLng < maxLng &&
    maxLat > minLat
  ) {
    return res.status(400).json({
      error:
        "Please enter the coordinates in the following order: 'most southwesterly point, most northeasterly point' or 'minLng, maxLat, maxLng, minLat'",
    });
  }
  const highlights = Array.isArray(highlightCountries)
    ? highlightCountries
    : highlightCountries.split(",");
  const neCountriesTopoJson = getCountries("50m");
  const svg = ReactDOMServer.renderToStaticMarkup(
    <LocatorMap
      theme={theme ?? defaultTheme}
      neCountriesTopoJson={neCountriesTopoJson}
      highlight={highlights}
      width={width}
      rectangleMarkers={[
        {
          bounds: [minLng, maxLat, maxLng, minLat],
        },
      ]}
    ></LocatorMap>,
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
