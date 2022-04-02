import * as df from "data-forge";

export default async function cleanContacts(input: Object[]) {
  const contacts = new df.DataFrame(input);

  console.log(contacts.getColumnNames());

  return contacts.toArray();
}
