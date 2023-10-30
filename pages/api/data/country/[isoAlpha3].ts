import { Country, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getCountry from "../../../../lib/data/queries/country/getCountry";
import { RequestError } from "../../../../types/RequestError";

/**
 * @swagger
 * /api/data/country:
 *   get:
 *     description: Returns country json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Country | RequestError>,
) {
  const { isoAlpha3 } = req.query;
  if (!isoAlpha3 || Array.isArray(isoAlpha3))
    return res
      .status(400)
      .json({ error: "Exact one country code is required" });
  try {
    const country = await getCountry(isoAlpha3);
    return res.status(200).json(country);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(400)
          .json({ error: `No country matched code ${isoAlpha3}` });
      }
    }
    throw e;
  }
}
