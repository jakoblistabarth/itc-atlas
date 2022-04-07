import type { NextApiRequest, NextApiResponse } from "next";
import { Staff } from "../../../types/Staff";
import getStaff from "../../../lib/getStaff";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Staff[]>
) {
  res.status(200).json(await getStaff());
}
