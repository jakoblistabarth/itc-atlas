import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

/**
 * @swagger
 * /api/maps/flights3D:
 *   get:
 *     summary: 3D map on ITC flights of 2019.
 *     description: Returns ITC flights 3D image
 *     tags:
 *       - JPEG
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: implement caching? Don't start browser if screenshot already exists in cache
  // TODO: only launch browser if browser is not already launched
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 6,
  });

  await page.goto(`${process.env.SITE_URL}/flights2019/flights3D`);

  const selector = "div[data-ready='true'] canvas";
  await page.waitForSelector(selector); // wait for the selector to load
  const canvas = await page.$(selector);
  // TODO: wait for selector fails after 30s, how to improve error message?
  if (!canvas) return;
  const screenshot = await canvas.screenshot({
    type: "jpeg",
    quality: 100,
    //   path: ".cache/screenshots/<filename>.jpg"
  });
  await browser.close();

  res.status(200).setHeader("Content-Type", "image/jpeg;").send(screenshot);
}
