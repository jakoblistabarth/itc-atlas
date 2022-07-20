import type { FeatureCollection } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import getFlights2019 from "../../../lib/data/getFlights2019";
import type { ODMatrix } from "../../../types/ODMatrix";
import { Flight } from "../../../types/Travels";

type travelData = {
  flights: Flight[];
  odMatrix: ODMatrix;
  perAirport: FeatureCollection;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<travelData>
) {
  res.status(200).json(await getFlights2019());
}
