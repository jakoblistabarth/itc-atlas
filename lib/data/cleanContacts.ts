import DataFrame from "../DataFrame/DataFrame";
import { Contact } from "../../types/Contact";

export default async function cleanContacts(
  input: unknown[]
): Promise<Contact[]> {
  const contacts = new DataFrame(input)
    .dropColumn([
      "Name",
      "UTstudentno",
      "CountryCodeOrigin",
      "ISONationality",
      "Remarks",
      "Comments",
    ])
    .renameColumn({ "Final Score": "finalScore" })
    .renameColumn({ "Date of Birth": "dateOfBirth" });

  return contacts.toArray();
}
