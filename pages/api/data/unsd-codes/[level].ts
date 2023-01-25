import type { NextApiRequest, NextApiResponse } from "next";
import loadUnsdCodes from "../../../../lib/data/load/loadUnsdCodes";
import { UnLevel } from "../../../../types/UnsdCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { level } = req.query;
  const levelStr = Array.isArray(level) ? level.toString() : level;
  if (!levelStr) res.status(400).json({ error: "a level is required" });
  else if (!Object.values(UnLevel).includes(levelStr as UnLevel)) {
    res.status(400).json({ error: "invalid level" });
  } else {
    const levelStrEnum = levelStr as UnLevel;
    res.status(200).json(await loadUnsdCodes(levelStrEnum)); //TODO: get this from the database!
  }
}
