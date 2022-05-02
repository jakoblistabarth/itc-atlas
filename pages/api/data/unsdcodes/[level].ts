// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getUnsdCodes from "../../../../lib/data/getUnsdCodes";
import { UnLevel } from "../../../../types/UnsdCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query ?? UnLevel.Countries;
  const level = typeof q === "string" ? q : q[0];
  res.status(200).json(await getUnsdCodes(level));
}
