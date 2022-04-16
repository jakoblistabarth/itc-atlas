import type { NextApiRequest, NextApiResponse } from "next";
import getContacts from "../../../lib/data/getContacts";
import { Contact } from "../../../types/Contact";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Contact[]>
) {
  res.status(200).json(await getContacts());
}
