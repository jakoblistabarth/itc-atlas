import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import HierarchyTree, {
  Hierarchy,
} from "../../../components/charts/HierarchyTree";
import { readFileSync } from "fs";

// this api endpoint is not working!
// it relies on being rendered in a browser
// the static markup returns an svg with the wrong
// width (0) and height (always 200) for viewBox
/**
 * @swagger
 * /api/maps/toc-naivasha-static:
 *   get:
 *     description: Returns toc-naivasha-static svg
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const hierarchy = JSON.parse(
    readFileSync("./data/static/toc-naivasha.json", "utf-8")
  ) as Hierarchy;

  const component = ReactDOMServer.renderToStaticMarkup(
    <HierarchyTree height={200} hierarchy={hierarchy} />
  );

  // remove wrapping div to get valid svg response
  const svg = component
    .replace(/<\/?[\w\s="/.':;#-\/\?]+>/m, "")
    .replace(/<\/?[\w\s="/.':;#-\/\?]+>$/m, "");

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
