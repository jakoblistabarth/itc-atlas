import type { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import WordCloud from "../../../components/charts/WordCloud";
import getTextFromFile from "../../../lib/data/getTextFromFile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const words = await getTextFromFile(
    "./data/static/naivasha-msc-theses-titles.txt"
  );

  const svg = ReactDOMServer.renderToStaticMarkup(
    <WordCloud width={960} height={600} text={"das ist ein text"} />
  );

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8;")
    .send(svg);
}
