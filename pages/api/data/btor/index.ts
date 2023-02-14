import type { NextApiRequest, NextApiResponse } from "next";
import getBtorsWithRelations, {
  BtorsWithRelations,
} from "../../../../lib/data/queries/btors/getBtors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BtorsWithRelations>
) {
  res.status(200).json(await getBtorsWithRelations());
}
