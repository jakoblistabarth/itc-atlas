import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

/**
 * @swagger
 * /api/maps/toc-naivasha:
 *   get:
 *     summary: 2D map of toc-naivasha.
 *     description: Returns toc-naivasha map
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
    res
      .status(404)
      .setHeader("Content-Type", "text/html; charset=utf-8;")
      .send(e);
  } finally {
    await browser.close();
  }
}
