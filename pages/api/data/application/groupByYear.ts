import type { NextApiRequest, NextApiResponse } from "next";
import getApplicationsByYear, {
  ApplicationByYearWithCount,
} from "../../../../lib/data/queries/application/getApplicationsByYear";
import { ResponseError } from "../../../../types/ResponseErrors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApplicationByYearWithCount | ResponseError>
) {
  const { query } = req;
  const country = query.country?.toString();
  if (!country)
    return res.status(400).json({
      error:
        "invalid query parameter for country, please use a valid ISO-alpha-3 country code",
      timestamp: new Date().toUTCString(),
      path: req.toString(),
    });
  res.status(200).json(await getApplicationsByYear(country));
}
