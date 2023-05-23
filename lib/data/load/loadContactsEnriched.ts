import getItcStudentIdIndex from "../id-indices/getItcStudentIdIndex";
import getApplicantIdIndex from "../id-indices/getApplicantIdIndex";
import loadContacts from "./loadContacts";

const loadContactsEnriched = async () => {
  const contacts = await loadContacts();
  const itcStudentIdIndex = getItcStudentIdIndex(contacts);
  const applicantIdIndex = getApplicantIdIndex(contacts);

  return contacts.map((d) => ({
    ...d,
    "ITC Student No._actual": d["ITC Student No."],
    "ITC Student No.": itcStudentIdIndex.get(d["ITC Student No."] ?? ""),
    ContactNo_actual: d["ContactNo"],
    ContactNo: applicantIdIndex.get(d["ContactNo"] ?? ""),
  }));
};
export default loadContactsEnriched;

export type ContactEnriched = Awaited<
  ReturnType<typeof loadContactsEnriched>
>[number];
