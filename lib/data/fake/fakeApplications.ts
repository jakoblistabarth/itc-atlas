import { faker } from "@faker-js/faker";
import { ApplicantClean } from "../../../types/ApplicantClean";
import { range, sample } from "lodash";
import { ApplicationClean } from "../../../types/ApplicationClean";
import loadStatus from "../load/loadStatus";
import addDays from "../../utilities/addDays";

const fakeApplications = async (
  applicants: ApplicantClean[],
  number: number = 7000
): Promise<ApplicationClean[]> => {
  const status = loadStatus();
  const courseIds = range(3000).map((d) => "C00" + faker.random.numeric(4));
  const sponsorNames = range(100).map((_) => faker.company.name());
  const certificates = [
    "Certificate of Attendance",
    "Diploma",
    "Certificate",
    "Degree",
  ];
  const levels = [
    "IME",
    "SC",
    "GRAD.AIO",
    "M",
    "AFUT",
    "DE",
    "TM",
    "IM",
    "RC",
    "DED",
    "MSC",
    "GRAD.CO",
    "MSCD",
    "GRAD.EPHD",
    "DPL",
    "PG",
    "SCD",
    "COM",
    "GRAD.PHD",
    "GRAD.INT",
  ];

  const data = range(number).map((d) => {
    const enrollmentStart = faker.date.between(new Date("1950"), new Date());
    const enrollmentEnd = addDays(
      enrollmentStart,
      sample([14, 180, 365]) as number
    );
    const certificationDate = addDays(
      enrollmentEnd,
      sample(range(2, 30)) as number
    );
    const application: ApplicationClean = {
      id: String(d),
      applicantId: sample(applicants)?.applicantId ?? "",
      applicantId_actual: "doesNotApply",
      statusId: sample(status)?.id ?? "",
      courseId: sample(courseIds) ?? "",
      enrollmentStart: enrollmentStart,
      enrollmentEnd: enrollmentEnd,
      certificationDate: certificationDate,
      examYear: certificationDate.getFullYear(),
      sponsor: Math.random() > 0.5 ? sample(sponsorNames) ?? "" : "",
      certificateType: Math.random() > 0.2 ? sample(certificates) ?? "" : "",
      level: Math.random() > 0.1 ? sample(levels) : "",
    };
    return application;
  });

  return data;
};

export default fakeApplications;
