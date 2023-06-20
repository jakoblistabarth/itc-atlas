import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/map/LocatorMap";
import getCountries from "../../../lib/data/getCountries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const width = req.query.width ? Number(req.query.width) : undefined;
  if (Number.isNaN(width)) {
    return res.status(400).json({ error: "invalid width parameter" });
  }
  const highlightCountries = req.query.country?.toString();
  const [minLng, maxLat, maxLng, minLat] =
    req.query.bounds?.toString().split(",").map(Number) ?? [];
  if (!highlightCountries) {
    res.status(400).json({ error: "invalid iso-3-code name" });
  }
  if (
    minLng < -180.0 &&
    maxLat > 90.0 &&
    maxLng > 180.0 &&
    minLat < -90.0 &&
    minLng < maxLng &&
    maxLat > minLat
  ) {
    res.status(400).json({
      error:
        "Please enter the coordinates in the following order: 'most southwesterly point, most northeasterly point' or 'minLng, maxLat, maxLng, minLat'",
    });
  }
  const highlights: string[] = [highlightCountries ?? ""];
  const neCountriesTopoJson = getCountries();
  const svg = ReactDOMServer.renderToStaticMarkup(
    <LocatorMap
      neCountriesTopoJson={neCountriesTopoJson}
      highlight={highlights}
      width={width}
      rectangleMarkers={[
        {
          bounds: [minLng, maxLat, maxLng, minLat],
        },
      ]}
    ></LocatorMap>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
