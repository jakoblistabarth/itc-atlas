import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import LocatorMap from "../../../components/map/LocatorMap";
import getCountries from "../../../lib/data/getCountries";
import RectangleMarker from "../../../components/map/RectangleMarker";
import RoundMarker from "../../../components/map/RoundMarker";
import { Vector2 } from "three";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const highlightCountries = req.query.country?.toString();
  const lat=req.query.lat?.toString();
  const lng=req.query.lng?.toString();
  if (!highlightCountries) {
    res.status(400).json({ error: "invalid iso-3-code name" });
  }
  //const marker=[32.723084,86.933545];
  const marker=[Number(lat),Number(lng)];
  var position:number[][]=[marker];
  var highlights:string[]=[highlightCountries??""];
  const neCountriesTopoJson = getCountries();
  const width=25;
  const height=10;
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
