import { Employee } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getEmployees from "../../../../lib/data/getEmployees";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employee[]>
) {
  res.status(200).json(await getEmployees());
}
