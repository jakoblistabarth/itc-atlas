import type { NextApiRequest, NextApiResponse } from "next";
import getCountries from "../../../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../../../types/NeTopoJson";

/**
 * @swagger
 * /api/data/geo/countries:
 *   get:
 *     description: Returns geo-countries json, "scale" is the query parameter, please specify the scale ("undefined","10m","50m","110m")
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
  res: NextApiResponse<NeCountriesTopoJson | { error: string }>
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

  res.status(200).json(getCountries(scale));
}
