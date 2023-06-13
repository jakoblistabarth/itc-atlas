import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/map/LocatorMap";
import getCountries from "../../../lib/data/getCountries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const highlightCountries = req.query.country?.toString();
  const bounds = req.query.bounds?.toString().split(",").map(Number) ?? [];
  if (!highlightCountries) {
    res.status(400).json({ error: "invalid iso-3-code name" });
  }
  if (
    bounds[0] < -180.0 &&
    bounds[1] > 90.0 &&
    bounds[2] > 180.0 &&
    bounds[3] < -90.0 &&
    bounds[0]! < bounds[2] &&
    bounds[1]! > bounds[3]
  ) {
    res
      .status(400)
      .json({ error: "Please enter in order:minLng,maxLat,maxLng,minLat" });
  }
  const highlights: string[] = [highlightCountries ?? ""];
  const neCountriesTopoJson = getCountries();
  const svg = ReactDOMServer.renderToStaticMarkup(
    <LocatorMap
      neCountriesTopoJson={neCountriesTopoJson}
      highlight={highlights}
      rectangleMarkers={[
        {
          minLng: bounds[0],
          maxLat: bounds[1],
          maxLng: bounds[2],
          minLat: bounds[3],
        },
      ]}
    ></LocatorMap>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
