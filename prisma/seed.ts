import { createId } from "@paralleldrive/cuid2";
import {
  Prisma,
  ProjectStatus,
  ProjectType,
  PurposeOfTravel,
} from "@prisma/client";
import fakeApplicants from "../lib/data/fake/fakeApplicants";
import fakeApplications from "../lib/data/fake/fakeApplications";
import fakeBTORS from "../lib/data/fake/fakeBtors";
import fakeEmployees from "../lib/data/fake/fakeEmployees";
import fakeEmployments from "../lib/data/fake/fakeEmployments";
import fakeFlights2019 from "../lib/data/fake/fakeFlights2019";
import fakePhds from "../lib/data/fake/fakePhds";
import fakeProjects from "../lib/data/fake/fakeProjects";
import loadDepartments from "../lib/data/load/loadDepartments";
import loadStatus from "../lib/data/load/loadStatus";
import loadUnsdCountries from "../lib/data/load/loadUnsdCountries";
import prisma from "./client";
import resetDatabase from "./resetDatabase";

async function main() {
  await resetDatabase();

  const [
    departments,
    status,
    countries,
    flights2019,
    btors,
    projects,
    applicants,
  ] = await Promise.all([
    loadDepartments(),
    loadStatus(),
    loadUnsdCountries(),
    fakeFlights2019(),
    fakeBTORS(),
    fakeProjects(),
    fakeApplicants(),
  ]);
  console.log("Data loaded. 🚚");

  await Promise.all(
    departments.map(async (d) => {
      const createArgs: Prisma.DepartmentCreateArgs = {
        data: {
          id: d.id,
          name: d.name,
          number: d.number,
        },
      };
      return await prisma.department.create(createArgs);
    }),
  );
  console.log("Seeded model Department. 🌱");

  await Promise.all(
    status.map(async (d) => {
      const createArgs: Prisma.StatusCreateArgs = {
        data: {
          id: d.id,
          label: d.label,
        },
      };
      return await prisma.status.create(createArgs);
    }),
  );
  console.log("Seeded model Status. 🌱");

  await Promise.all(
    countries.map(async (d) => {
      const createArgs: Prisma.CountryCreateArgs = {
        data: {
          isoAlpha2: d["ISO-alpha2 Code"],
          isoAlpha3: d["ISO-alpha3 Code"],
          isoNum3: d["M49 Code"],
          nameEn: undefined, //TODO: implement alternative short name?
          nameLongEn: d["Country or Area"],
          unRegionCode: d["Region Code"],
          unSubRegionCode: d["Sub-region Code"],
          unIntermediateRegionCode: d["Intermediate Region Code"]
            ? d["Intermediate Region Code"]
            : undefined,
          ldc: d["Least Developed Countries (LDC)"] ? true : false,
          lldc: d["Land Locked Developing Countries (LLDC)"] ? true : false,
          sids: d["Small Island Developing States (SIDS)"] ? true : false,
        },
      };
      return await prisma.country.create(createArgs);
    }),
  );
  console.log("Seeded model Country. 🌱");

  const countriesDB = await prisma.country.findMany();

  await Promise.all(
    flights2019.map(async (d) => {
      const countryId = countriesDB.find((c) => d.country === c.isoAlpha3)?.id;
      const createArgs: Prisma.Flight2019CreateArgs = {
        data: {
          country: countryId
            ? {
                connect: { id: countryId },
              }
            : {},
          departure: d.departure,
          arrival: d.arrival,
          type: d.type,
          department: d.department
            ? {
                connect: {
                  number: d.department,
                },
              }
            : {},
          emissions: d.emissions,
          airportCodes: d.airportCodes,
        },
      };
      return await prisma.flight2019.create(createArgs);
    }),
  );
  console.log("Seeded model Flight2019. 🌱");

  await Promise.all(
    btors.map(async (d) => {
      const countryIds = countriesDB
        .filter((c) => d.countries.includes(c.isoAlpha3))
        .map((d) => d.id);
      const createArgs: Prisma.BtorCreateArgs = {
        data: {
          countries: {
            connect: countryIds.map((d) => ({ id: d })),
          },
          start: d.start,
          end: d.end,
          year: d.year,
          departments: {
            connect: d.departments?.map((d) => ({ id: d })),
          },
          purpose: d.purpose as PurposeOfTravel,
        },
      };
      return await prisma.btor.create(createArgs);
    }),
  );
  console.log("Seeded model Btor. 🌱");

  await Promise.all(
    projects.map(async (d) => {
      const countryIds = countriesDB
        .filter((c) => d.allCountries.includes(c.isoAlpha3))
        .map((d) => d.id);
      const createArgs: Prisma.ProjectCreateArgs = {
        data: {
          id: d.id,
          name: d.name,
          nameShort: d.nameShort,
          description: d.description,
          countries: {
            connect: countryIds.map((d) => ({ id: d })),
          },
          start: d.dateStart,
          end: d.dateEnd,
          departmentsMain: {
            connect: d.departmentsMain?.map((d) => ({ id: d })),
          },
          departmentsSecondary: {
            connect: d.departmentsSecondary?.map((d) => ({ id: d })),
          },
          leadOrganization: d.leadOrganization,
          fundingOrganization: d.fundingOrganization,
          type: d.type as ProjectType,
          status: d.status as ProjectStatus,
        },
      };
      return await prisma.project.create(createArgs);
    }),
  );
  console.log("Seeded model Project. 🌱");

  await Promise.all(
    applicants.map(async (d) => {
      const country = countriesDB.find(
        (c) => c.isoAlpha3 === d.countryIsoAlpha3,
      );

      const createArgs: Prisma.ApplicantCreateArgs = {
        data: {
          id: d.applicantId,
          gender: d.gender,
          itcStudentId: d.itcStudentId,
          countryId: country?.id,
          yearOfBirth: d.dateOfBirth?.getFullYear(),
        },
      };
      return await prisma.applicant.create(createArgs);
    }),
  );
  console.log("Seeded model Applicant. 🌱");

  const applications = await fakeApplications(applicants);

  await Promise.all(
    applications.map(async (d) => {
      const createArgs: Prisma.ApplicationCreateArgs = {
        data: {
          id: d.id,
          applicantId: d.applicantId,
          departments: d.departments
            ? {
                connect: d.departments.map((d) => ({ id: d })),
              }
            : {},
          courseId: d.courseId,
          programmId: d.programmId,
          level: d.level,
          statusId: d.statusId,
          examYear: d.examYear,
          enrollmentStartYear: d.enrollmentStart?.getFullYear(),
          enrollmentEndYear: d.enrollmentEnd?.getFullYear(),
          certificationYear: d.certificationDate?.getFullYear(),
          sponsor: d.sponsor,
          certificateType: d.certificateType,
        },
      };
      return await prisma.application.create(createArgs);
    }),
  );
  console.log("Seeded model Application. 🌱");

  const itcIdsInApplicants = await prisma.applicant.findMany({
    select: {
      itcStudentId: true,
    },
  });

  const phds = await fakePhds(applicants);

  await Promise.all(
    phds.map(async (d) => {
      const itcStudentId = itcIdsInApplicants
        .map((d) => d.itcStudentId)
        .includes(d.itcStudentId ?? null)
        ? d.itcStudentId
        : undefined;

      const country = countriesDB.find((c) => c.isoAlpha3 === d.country);

      const createArgs: Prisma.PhdCreateArgs = {
        data: {
          id: createId(),
          itcStudentId: itcStudentId,
          departmentsMain: {
            connect: d.departmentsMain?.map((d) => ({ id: d })),
          },
          departmentsSecondary: {
            connect: d.departmentsSecondary?.map((d) => ({ id: d })),
          },
          thesisTitle: d.thesisTitle,
          statusId: d.status,
          startYear: d.dateStart?.getFullYear(),
          graduationYear: d.dateGraduation?.getFullYear(),
          promotionYear: d.yearPromotion,
          countryId: country?.id,
        },
      };
      return await prisma.phd.create(createArgs);
    }),
  );
  console.log("Seeded model Phd. 🌱");

  const employees = await fakeEmployees(applicants);

  await Promise.all(
    employees.map(async (d) => {
      const country = countriesDB.find((c) => c.isoAlpha3 === d.nationality);

      // TODO: add unit end?
      const createArgs: Prisma.EmployeeCreateArgs = {
        data: {
          id: d.mId,
          applicantId: d.applicantId,
          yearOfBirth: d.dateOfBirth?.getFullYear(),
          countryId: country?.id,
        },
      };
      return await prisma.employee.create(createArgs);
    }),
  );
  console.log("Seeded model Employee. 🌱");

  const employments = await fakeEmployments(employees);

  await Promise.all(
    employments.map(async (d) => {
      // TODO: add unit end?
      const createArgs: Prisma.EmploymentCreateArgs = {
        data: {
          id: createId(),
          employeeId: d.mId,
          startYear: d.startYear,
          endYear: d.endYear,
          employedDays: d.employedDays,
          departments: {
            connect: d.departments?.map((d) => ({ id: d })),
          },
        },
      };
      return await prisma.employment.create(createArgs);
    }),
  );
  console.log("Seeded model Employment. 🌱");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
