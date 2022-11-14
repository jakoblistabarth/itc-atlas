import type { NextApiRequest, NextApiResponse } from "next";
import getPopulatedPlaces from "../../../lib/data/getPopulatedPlaces";
import { NePopulatedPlaces } from "../../../types/NeTopoJson";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NePopulatedPlaces>
) {
  res.status(200).json(getPopulatedPlaces("10m"));
}
