import loadContacts, { ContactRaw } from "./loadContacts";
import * as aq from "arquero";
import { ddmmyyyyToDate } from "../../utilities/timeparser";
import { ApplicantClean } from "../../../types/ApplicantClean";

export const loadApplicants = async () => {
  const data = await loadContacts();

  const tb = aq
    .from(data)
    .rename({
      ContactNo: "applicantId",
      ISONationality: "countryIsoAlpha3", //QUESTION: ask Menno-Jan whether we should use ?? d.CountryCodeOrigin as fallback
    })
    .dedupe("applicantId")
    .derive({
      itcStudentId: aq.escape((d: ContactRaw) =>
        d["ITC Student No."] === "[history-pre 2017]"
          ? null
          : d["ITC Student No."]
      ),
      dateOfBirth: aq.escape((d: ContactRaw) => {
        if (!d["Date of Birth"]) return null;
        if (d["Date of Birth"] === "01-01-1990") return null;
        return ddmmyyyyToDate(d["Date of Birth"]);
      }),
      gender: aq.escape((d: ContactRaw) =>
        d.Gender === "Male" ? "m" : d.Gender === "Female" ? "f" : null
      ),
    })
    .select(
      "applicantId",
      "itcStudentId",
      "gender",
      "dateOfBirth",
      "countryIsoAlpha3"
    );

  return tb.objects() as ApplicantClean[];
};

export default loadApplicants;
