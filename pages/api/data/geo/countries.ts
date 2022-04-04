// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getCountries from "../../../../lib/getCountries";
import { Topology } from "topojson-specification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Topology | { error: string }>
) {
  const scale = req.query.scale?.toString();

  // use type guard with enum
  if (
    scale !== undefined &&
    scale !== "10m" &&
    scale !== "50m" &&
    scale !== "110m"
  )
    return res.status(400).json({ error: "invalid scale param" });

  res.status(200).json(await getCountries(scale));
}
