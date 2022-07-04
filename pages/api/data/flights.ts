import type { NextApiRequest, NextApiResponse } from "next";
import getFlights from "../../../lib/data/getFlights";
import type { Data, Row } from "../../../types/DataFrame";
import type { FeatureCollection } from "geojson";
import type { ODMatrix } from "../../../types/ODMatrix";

type travelData = {
  allTravels: unknown[];
  flights: Data<Row>;
  odMatrix: ODMatrix;
  perAirport: FeatureCollection;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<travelData>
) {
  res.status(200).json(await getFlights());
}
