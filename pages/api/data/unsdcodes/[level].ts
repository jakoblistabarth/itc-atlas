import type { NextApiRequest, NextApiResponse } from "next";
import getUnsdCodes from "../../../../lib/data/getUnsdCodes";
import { UnLevel } from "../../../../types/UnsdCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { level } = req.query;
  console.log(level);
  const levelStr = Array.isArray(level) ? level.toString() : level;
  if (!(levelStr in UnLevel)) {
    res.status(500).json({ error: "invalid level" });
  } else {
    const levelStrEnum = levelStr as unknown as UnLevel;
    res.status(200).json(await getUnsdCodes(levelStrEnum));
  }
}
