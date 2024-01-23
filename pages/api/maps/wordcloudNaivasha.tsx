import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

/**
 * @swagger
 * /api/maps/wordcloudNaivasha:
 *   get:
 *     summary: 2D map of wordcloudNaivasha.
 *     description: Returns wordcloudNaivasha map
 *     tags:
 *       - SVG
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: implement caching? Don't start browser if screenshot already exists in cache
  // TODO: only launch browser if browser is not already launched
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.goto(
    `${process.env.SITE_URL}/institutional-strengthening/naivasha`,
  );

  await new Promise((r) => setTimeout(r, 5000));
  const selector = "#wordcloud svg";
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
