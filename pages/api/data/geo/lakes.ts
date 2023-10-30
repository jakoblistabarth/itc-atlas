import type { NextApiRequest, NextApiResponse } from "next";
import getLakes from "../../../../lib/data/getLakes";
import { NeLakes } from "../../../../types/NeTopoJson";
import { RequestError } from "../../../../types/RequestError";

/**
 * @swagger
 * /api/data/geo/lakes:
 *   get:
 *     description: Returns geo-lakes json, "scale" is the query parameter, please specify the scale
 *     parameters:
 *        - in: query
 *          name: scale
 *          type: string
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NeLakes | RequestError>,
) {
  const scale = req.query.scale?.toString();
  //TODO: use type guard with enum
  if (
    scale !== undefined &&
    scale !== "10m" &&
    scale !== "50m" &&
    scale !== "110m"
  )
    return res.status(400).json({ error: "invalid scale param" });

  res.status(200).json(getLakes(scale));
}
