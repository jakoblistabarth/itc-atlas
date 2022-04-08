import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/getAirports";
import { DataFrame } from "../../../types/DataFrame";
import { GeoJSON } from "geojson";

type Data = {
  json: DataFrame;
  geoJSON: GeoJSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getAirports());
}
