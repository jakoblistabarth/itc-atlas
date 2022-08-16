import type { NextApiRequest, NextApiResponse } from "next";
import getLakes from "../../../../lib/data/getLakes";
import { NeLakes } from "../../../../types/NeTopoJson";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NeLakes | { error: string }>
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
