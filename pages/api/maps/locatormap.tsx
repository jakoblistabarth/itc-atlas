import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/map/LocatorMap";
import getCountries from "../../../lib/data/getCountries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const highlightCountries = req.query.country?.toString();
  const lat = Number(req.query.lat?.toString());
  const lng = Number(req.query.lng?.toString());
  const width = Number(req.query.width?.toString());
  const height = Number(req.query.height?.toString());
  if (!highlightCountries) {
    res.status(400).json({ error: "invalid iso-3-code name" });
  }
  const marker = [lat, lng];
  var position: number[][] = [marker];
  var highlights: string[] = [highlightCountries ?? ""];
  const neCountriesTopoJson = getCountries();
  const svg = ReactDOMServer.renderToStaticMarkup(
    <LocatorMap
      neCountriesTopoJson={neCountriesTopoJson}
      highlight={highlights}
      rectwidth={width}
      rectheight={height}
      rectanglehighlight={position}
    ></LocatorMap>
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
