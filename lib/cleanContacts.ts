import * as df from "data-forge";
import { Contact } from "../types/Contact";

export default async function cleanContacts(
  input: unknown[]
): Promise<Contact[]> {
  const contacts = new df.DataFrame(input);

  return contacts.toArray();
}
