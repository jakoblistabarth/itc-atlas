import loadApplicants from "../load/loadApplicants";
import { EmployeeClean } from "../../../types/EmployeeClean";
import loadContactsEnriched, {
  ContactEnriched,
} from "../load/loadContactsEnriched";
import loadEmploymentsEmployees from "../load/loadEmploymentsEmployees";
import { describe, test, expect, beforeAll } from "@jest/globals";
import { ApplicantClean } from "../../../types/ApplicantClean";

let contacts: ContactEnriched[];
let applicants: ApplicantClean[];
let employees: EmployeeClean[];
let matches: Match[];

type Match = {
  gender: string;
  nationality: string;
  dateOfBirth?: Date;
  matches: number;
  contactId: string;
};

beforeAll(async () => {
  contacts = await loadContactsEnriched();
  applicants = await loadApplicants(contacts);
  ({ employees: employees } = await loadEmploymentsEmployees());
  matches = employees.reduce((acc: Match[], s) => {
    if (s.dateOfBirth === null || s.gender === null || s.nationality === null)
      return acc;
    const match = applicants.filter((c) => {
      return (
        c.gender === s.gender &&
        c.dateOfBirth?.getTime() === s.dateOfBirth?.getTime() &&
        c.countryIsoAlpha3 === s.nationality
      );
    });
    if (match.length === 0) return acc;
    const c = match[0];
    acc.push({
      gender: c.gender,
      nationality: c.countryIsoAlpha3,
      dateOfBirth: s.dateOfBirth,
      matches: match.length,
      contactId: c.applicantId.slice(0, 7),
    });
    return acc;
  }, []);
}, 16000);

describe("Employees match with", () => {
  test("applicants in 587 cases", () => {
    expect(matches.length).toBe(587);
  });
});

describe("Employees should not match with multiple contacts", () => {
  test.failing("which makes matching ambiguous", () => {
    expect(matches.filter((d) => d.matches > 1).length).toBe(0);
  });
});
