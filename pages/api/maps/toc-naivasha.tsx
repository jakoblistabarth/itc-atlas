import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: implement caching? Don't start browser if screenshot already exists in cache
  // TODO: only launch browser if browser is not already launched
  const browser = await getBrowser();
  const page = await browser.newPage();

  // TODO: use a env variable with the absolute url of the website here?
  await page.goto("http://localhost:3000/projects/naivasha");

  const selector = "svg.hierarchy-tree";
  await page.waitForSelector(selector);
  const node = await page.$(selector);
  await node?.waitForSelector(".visx-group");
  try {
    const element = node?.asElement();
    const svg = await element?.evaluate((e) => e.outerHTML);
    res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8;")
      .send(svg);
  } catch (e) {
    const string = node?.toString();
    console.log({ string, e });

    res
      .status(404)
      .setHeader("Content-Type", "text/html; charset=utf-8;")
      .send(e);
  } finally {
    await browser.close();
  }
}
