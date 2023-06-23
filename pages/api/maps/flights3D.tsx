import type { NextApiRequest, NextApiResponse } from "next";
import getBrowser from "../../../puppeteer/browser";

/**
 * @swagger
 * /api/maps/flights3D:
 *   get:
 *     description: Returns flights3D image
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

  // TODO: use a env variable with the absolute url of the website here?
  await page.goto("http://localhost:3000/flights2019/flights3D");

  const selector = "canvas";
  await page.waitForSelector(selector); // wait for the selector to load
  // TODO: use a method of puppeter to define timeout instead of manually defining a time?
  await new Promise((r) => setTimeout(r, 800));
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
