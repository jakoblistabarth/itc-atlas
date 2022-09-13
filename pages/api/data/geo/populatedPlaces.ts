import type { NextApiRequest, NextApiResponse } from "next";
import getPopulatedPlaces from "../../../../lib/data/getPopulatedPlaces";
import { NePopulatedPlaces } from "../../../../types/NeTopoJson";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NePopulatedPlaces | { error: string }>
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

  res.status(200).json(getPopulatedPlaces(scale));
}
