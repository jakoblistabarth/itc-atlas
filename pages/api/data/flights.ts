// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getFlights from "../../../lib/data/getFlights";
import { Flight } from "../../../types/Flight";
import { FeatureCollection } from "geojson";

type Data = {
  originalData: Array<object>;
  data: Flight[];
  odMatrix: Array<object>;
  perAirport: FeatureCollection;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getFlights());
}
