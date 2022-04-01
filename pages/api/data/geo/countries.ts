// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getCountries from "../../../../lib/getCountries";
import { TopoJSON } from "topojson-specification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TopoJSON>
) {
  res.status(200).json(await getCountries("110m"));
}
