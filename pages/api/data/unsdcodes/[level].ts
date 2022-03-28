// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getUnsdCodes from "../../../../lib/getUnsdCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { level } = req.query;
  console.log(level);
  res.status(200).json(await getUnsdCodes(level));
}
