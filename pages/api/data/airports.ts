import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/getAirports";

type Data = {
  data: number[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getAirports());
}
