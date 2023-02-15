import { Flight2019 } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getFlights2019 from "../../../../lib/data/queries/flight2019/getFlights2019";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Flight2019[]>
) {
  res.status(200).json(await getFlights2019());
}
