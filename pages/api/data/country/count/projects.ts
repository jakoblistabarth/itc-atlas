import type { NextApiRequest, NextApiResponse } from "next";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../../../../lib/data/queries/country/getCountryWithProjectCount";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryWithProjectCount>
) {
  res.status(200).json(await getCountryWithProjectCount());
}
