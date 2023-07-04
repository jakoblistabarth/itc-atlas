import type { NextApiRequest, NextApiResponse } from "next";
import getElevationData from "../../../../lib/data/getElevationData";

/**
 * @swagger
 *  /api/data/elevationModel/{name}:
 *   get:
 *     description: Returns elevation json, "name" is the path parameter, please specify the name of area
 *     tags:
 *       - data
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "a name is required" });
  if (Array.isArray(name))
    return res.status(500).json({ error: "Name needs to be a plain string" });
  res.status(200).json(await getElevationData(name));
}
