import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/getAirports";
import { Table } from "../../../types/Table";
import { GeoJSON } from "geojson";

type Data = {
  json: Table;
  geoJSON: GeoJSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getAirports());
}
