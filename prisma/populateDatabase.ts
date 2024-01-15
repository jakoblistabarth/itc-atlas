import {
  Prisma,
  ProjectStatus,
  ProjectType,
  PurposeOfTravel,
} from "@prisma/client";
import prisma from "./client";
import loadDepartments from "../lib/data/load/loadDepartments";
import loadPhds from "../lib/data/load/loadPhds";
import loadUnsdCountries from "../lib/data/load/loadUnsdCountries";
import loadProjects from "../lib/data/load/loadProjects";
import loadStatus from "../lib/data/load/loadStatus";
import loadBtors from "../lib/data/load/loadBtors";
import loadFlights2019 from "../lib/data/load/loadFlights2019";
import resetDatabase from "./resetDatabase";
import loadApplicationsApplicants from "../lib/data/load/loadApplicationsApplicants";
import { createId } from "@paralleldrive/cuid2";
import loadEmploymentsEmployees from "../lib/data/load/loadEmploymentsEmployees";

async function main() {
  await resetDatabase();

  const [
    departments,
    status,
    countries,
    phds,
    { applications, applicants },
    { employments, employees },
    projects,
    btors,
    flights2019,
  ] = await Promise.all([
    loadDepartments(),
    loadStatus(),
    loadUnsdCountries(),
    loadPhds(),
    loadApplicationsApplicants(),
    loadEmploymentsEmployees(),
    loadProjects(),
    loadBtors(),
    loadFlights2019(),
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
  console.log("Populated model Department. 🌱");

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
  console.log("Populated model Status. 🌱");

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
  console.log("Populated model Country. 🌱");

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
  console.log("Populated model Flight2019. 🌱");

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
          departments: d.departments
            ? {
                connect: d.departments.map((d) => ({ id: d })),
              }
            : {},
          purpose: d.purpose as PurposeOfTravel,
        },
      };
      return await prisma.btor.create(createArgs);
    }),
  );
  console.log("Populated model Btor. 🌱");

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
          departmentsMain: d.departmentsMain
            ? {
                connect: d.departmentsMain.map((d) => ({ id: d })),
              }
            : {},
          departmentsSecondary: d.departmentsSecondary
            ? {
                connect: d.departmentsSecondary.map((d) => ({ id: d })),
              }
            : {},
          leadOrganization: d.leadOrganization,
          fundingOrganization: d.fundingOrganization,
          type: d.type as ProjectType,
          status: d.status as ProjectStatus,
        },
      };
      return await prisma.project.create(createArgs);
    }),
  );
  console.log("Populated model Project. 🌱");

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
          yearOfBirth: d.yearOfBirth,
        },
      };
      return await prisma.applicant.create(createArgs);
    }),
  );
  console.log("Populated model Applicant. 🌱");

  await Promise.all(
    applications.map(async (d) => {
      const createArgs: Prisma.ApplicationCreateArgs = {
        data: {
          id: createId(),
          applicantId: d.applicantId,
          departments: d.departments
            ? {
                connect: d.departments.map((d) => ({ id: d })),
              }
            : {},
          courseId: d.courseId,
          programmId: d.programmId,
          level: d.level,
          level_detailed: d.level_detailed,
          statusId: d.statusId,
          examYear: d.examYear,
          enrollmentStartYear: d.enrollmentStart?.getFullYear(),
          enrollmentEndYear: d.enrollmentEnd?.getFullYear(),
          certificationYear: d.certificationDate?.getFullYear(),
          enrolledDays: d.enrolledDays,
          sponsor: d.sponsor,
          certificateType: d.certificateType,
        },
      };
      return await prisma.application.create(createArgs);
    }),
  );
  console.log("Populated model Application. 🌱");

  const itcIdsInApplicants = applicants
    .filter((d) => d.itcStudentId_actual)
    .map((d) => d.itcStudentId_actual);

  await Promise.all(
    phds.map(async (phd) => {
      const itcStudentId = itcIdsInApplicants.includes(phd.itcStudentId)
        ? phd.itcStudentId
        : null;

      const applicantMatch = applicants.find(
        (d) => itcStudentId && d.itcStudentId_actual === itcStudentId,
      );

      const country = countriesDB.find((c) => c.isoAlpha3 === phd.country);

      const createArgs: Prisma.PhdCreateArgs = {
        data: {
          id: createId(),
          itcStudentId: applicantMatch?.itcStudentId,
          departmentsMain: phd.departmentsMain
            ? {
                connect: phd.departmentsMain.map((department) => ({
                  id: department,
                })),
              }
            : {},
          departmentsSecondary: phd.departmentsSecondary
            ? {
                connect: phd.departmentsSecondary.map((department) => ({
                  id: department,
                })),
              }
            : {},
          thesisTitle: phd.thesisTitle,
          doi: phd.doi,
          name: phd.name,
          statusId: phd.status,
          startYear: phd.dateStart?.getFullYear(),
          graduationYear: phd.dateGraduation?.getFullYear(),
          promotionYear: phd.yearPromotion,
          countryId: country?.id,
        },
      };
      return await prisma.phd.create(createArgs);
    }),
  );
  console.log("Populated model Phd. 🌱");

  await Promise.all(
    employees.map(async (d) => {
      const country = countriesDB.find((c) => c.isoAlpha3 === d.nationality);

      const applicant =
        d.dateOfBirth && d.gender && country?.id
          ? applicants.find(
              (applicant) =>
                applicant.dateOfBirth?.getTime() === d.dateOfBirth?.getTime() &&
                applicant.gender === d.gender &&
                applicant.countryIsoAlpha3 === country.isoAlpha3,
            )
          : null;

      // TODO: add unit end?
      const createArgs: Prisma.EmployeeCreateArgs = {
        data: {
          id: d.mId,
          applicantId: applicant?.applicantId,
          yearOfBirth: d.dateOfBirth?.getFullYear(),
          countryId: country?.id,
        },
      };
      return await prisma.employee.create(createArgs);
    }),
  );
  console.log("Populated model Employee. 🌱");

  await Promise.all(
    employments.map(async (d) => {
      const departments = d.departments
        ? await prisma.department.findMany({
            select: { id: true },
            where: {
              id: {
                in: d.departments,
              },
            },
          })
        : null;

      // TODO: add unit end?
      const createArgs: Prisma.EmploymentCreateArgs = {
        data: {
          id: createId(),
          employeeId: d.mId,
          startYear: d.startYear,
          endYear: d.endYear,
          employedDays: d.employedDays,
          departments: departments
            ? {
                connect: d.departments.map((department) => ({
                  id: department,
                })),
              }
            : {},
        },
      };
      return await prisma.employment.create(createArgs);
    }),
  );
  console.log("Populated model Employment. 🌱");
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
