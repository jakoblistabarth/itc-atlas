import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/map/LocatorMap";
import getCountries from "../../../lib/data/getCountries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const highlightCountries = req.query.country?.toString();
  const bounds = req.query.bounds?.toString().split(" ").map(Number) ?? [
    0, 0, 0, 0,
  ];
  if (!highlightCountries) {
    res.status(400).json({ error: "invalid iso-3-code name" });
  }
  const highlights: string[] = [highlightCountries ?? ""];
  const neCountriesTopoJson = getCountries();
  const svg = ReactDOMServer.renderToStaticMarkup(
    <LocatorMap
      neCountriesTopoJson={neCountriesTopoJson}
      highlight={highlights}
      rectangleMarker={[
        {
          minlng: bounds[0],
          maxlat: bounds[1],
          maxlng: bounds[2],
          minlat: bounds[3],
        },
      ]}
    ></LocatorMap>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
