import type { NextApiRequest, NextApiResponse } from "next";
import getElevation from "../../../../lib/data/getElevation";

/**
 * @swagger
 * /api/data/elevation:
 *   get:
 *      description: Returns elevation json, "name" is the path parameter, please specify the name of area.
 *      tags:
 *        - data
 *      parameters:
 *        - in: query
 *          name: longitude
 *          required: true
 *          type: number
 *          example: 5.920616894
 *        - in: query
 *          name: latitude
 *          required: true
 *          type: number
 *          example: -55.2499057923
 *      responses:
 *        200:
 *          description: Ok.
 *        400:
 *          description: Bad request.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude)
    return res
      .status(400)
      .json({ error: "a latitude and longitude is required" });
  const [latitudeNumber, longitudeNumber] = [latitude, longitude].map((d) =>
    Number(d)
  );
  if (typeof latitudeNumber !== "number" || typeof longitudeNumber !== "number")
    return res
      .status(500)
      .json({ error: "Coordinates needs to be provided as numbers." });

  const elevation = await getElevation(longitudeNumber, latitudeNumber);
  res.status(200).json(elevation);
}
