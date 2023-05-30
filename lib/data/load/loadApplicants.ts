import { ContactEnriched } from "./loadContactsEnriched";
import * as aq from "arquero";
import { ApplicantClean } from "../../../types/ApplicantClean";
import { ddmmyyyyToDate } from "../../utilities/timeparser";

export const loadApplicants = async (contacts: ContactEnriched[]) => {
  const tb = aq
    .from(contacts)
    .rename({
      ContactNo: "applicantId",
      ISONationality: "countryIsoAlpha3", //QUESTION: ask Menno-Jan whether we should use ?? d.CountryCodeOrigin as fallback
    })
    .dedupe("applicantId")
    .derive({
      itcStudentId_actual: aq.escape((d: ContactEnriched) =>
        d["ITC Student No._actual"] === "[history-pre 2017]"
          ? null
          : d["ITC Student No._actual"]
      ),
      dateOfBirth: aq.escape((d: ContactEnriched) => {
        if (!d["Date of Birth"]) return null;
        if (d["Date of Birth"] === "01-01-1990") return null;
        return ddmmyyyyToDate(d["Date of Birth"]);
      }),
      yearOfBirth: (d: ContactEnriched) =>
        aq.op.parse_int(aq.op.substring(d["Date of Birth"], 6, 10), 10),
      gender: aq.escape((d: ContactEnriched) =>
        d.Gender === "Male" ? "m" : d.Gender === "Female" ? "f" : null
      ),
    })
    .rename({
      "ITC Student No.": "itcStudentId",
    })
    .select(
      "applicantId",
      "itcStudentId",
      "itcStudentId_actual",
      "gender",
      "yearOfBirth",
      "dateOfBirth",
      "countryIsoAlpha3"
    );

  return tb.objects() as ApplicantClean[];
};

export default loadApplicants;
