import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

/**
 * @swagger
 * /api/maps/indonesia:
 *   get:
 *     summary: timeline of ITC's activities in Indonesia.
 *     description: Returns a detailed timeline on ITC's activities in regards to projects, alumni and PhDs in Indonesia.
 *     tags:
 *        - SVG
 *     responses:
 *       200:
 *         description: response success
 *       400:
 *         description: bad request
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  // TODO: use a env variable with the absolute url of the website here?
  await page.goto("http://localhost:3000/print/indonesia");

  const selector = "main svg";
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
