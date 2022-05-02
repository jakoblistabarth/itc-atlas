import type { NextApiRequest, NextApiResponse } from "next";
import getApplicants from "../../../lib/data/getApplicants";
import { Applicant } from "../../../types/Applicant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Applicant[]>
) {
  res.status(200).json(await getApplicants());
}
