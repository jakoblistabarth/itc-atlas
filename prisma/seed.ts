import { Prisma, PrismaClient } from "@prisma/client";
import getDepartments from "../lib/data/getDepartments";
import getPhdCandidates from "../lib/data/getPhdCandidates";
import getUnsdCountries from "../lib/data/getUnsdCountries";
import getContacts from "../lib/data/getContacts";
import getEmployees from "../lib/data/getEmployees";
import getEmployments from "../lib/data/getEmployments";

const prisma = new PrismaClient();

async function main() {
  await prisma.phdCandidate.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.employment.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "PhdCandidate_id_seq" RESTART WITH 1;`;
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Country_id_seq" RESTART WITH 1;`;

  const [departments, countries, phds, contacts, employees, employments] =
    await Promise.all([
      getDepartments(),
      getUnsdCountries(),
      getPhdCandidates(),
      getContacts(),
      getEmployees(),
      getEmployments(),
    ]);

  await Promise.all(
    departments.map(async (d) => {
      const createArgs: Prisma.DepartmentCreateArgs = {
        data: {
          id: d.code,
          name: d.name,
        },
      };
      return await prisma.department.create(createArgs);
    })
  );

  await Promise.all(
    countries.map(async (d, idx) => {
      const createArgs: Prisma.CountryCreateArgs = {
        data: {
          isoAlpha2: d["ISO-alpha2 Code"],
          isoAlpha3: d["ISO-alpha3 Code"],
          isoNum3: d["M49 Code"],
          nameEn: undefined,
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
    })
  );

  await Promise.all(
    contacts.map(async (d, idx) => {
      const country = d.countryIsoAlpha3
        ? await prisma.country.findFirst({
            //TODO: it's probably very ineffcient to query db for every upsert
            select: { id: true },
            where: {
              isoAlpha3: {
                equals: d.countryIsoAlpha3 ?? undefined,
              },
            },
          })
        : null;

      const createArgs: Prisma.ContactCreateArgs = {
        data: {
          id: d.contactId,
          gender: d.gender,
          itcStudentId: d.itcStudentId,
          countryId: country?.id,
          dateOfBirth: d.dateOfBirth,
        },
      };
      return await prisma.contact.create(createArgs);
    })
  );

  const itcIdsInContacts = await prisma.contact.findMany({
    select: {
      itcStudentId: true,
    },
  });

  await Promise.all(
    phds.map(async (d, idx) => {
      const country = d.country
        ? await prisma.country.findFirst({
            select: { id: true },
            where: {
              isoAlpha3: {
                equals: d.country,
              },
            },
          })
        : null;

      const itcStudentId = itcIdsInContacts
        .map((d) => d.itcStudentId)
        .includes(d.itcStudentId)
        ? d.itcStudentId
        : null;

      const createArgs: Prisma.PhdCandidateCreateArgs = {
        data: {
          id: idx,
          itcStudentId: itcStudentId,
          departmentMainId: d.department1,
          departmentSecondaryId: d.department2,
          thesisTitle: d.thesisTitle,
          graduated: d.graduated,
          start: d.dateStart,
          graduation: d.dateGraduation,
          promotion: d.dateGraduation,
          countryId: country?.id,
        },
      };
      return await prisma.phdCandidate.create(createArgs);
    })
  );

  await Promise.all(
    employees.map(async (d, idx) => {
      const country = d.nationality
        ? await prisma.country.findFirst({
            select: { id: true },
            where: {
              isoAlpha3: {
                equals: d.nationality,
              },
            },
          })
        : null;

      const contact =
        d.dateOfBirth && d.gender && country?.id
          ? await prisma.contact.findFirst({
              select: { id: true },
              where: {
                dateOfBirth: {
                  equals: d.dateOfBirth,
                },
                gender: {
                  equals: d.gender,
                },
                countryId: {
                  equals: country?.id,
                },
              },
            })
          : null;

      // TODO: add unit end?
      const createArgs: Prisma.EmployeeCreateArgs = {
        data: {
          id: d.mId,
          contactId: contact?.id,
          dateOfBirth: d.dateOfBirth,
          countryId: country?.id,
        },
      };
      return await prisma.employee.create(createArgs);
    })
  );

  await Promise.all(
    employments.map(async (d, idx) => {
      const department = d.department
        ? await prisma.department.findFirst({
            select: { id: true },
            where: {
              id: {
                equals: d.department,
              },
            },
          })
        : null;

      // TODO: add unit end?
      const createArgs: Prisma.EmploymentCreateArgs = {
        data: {
          id: idx,
          employeeId: d.mId,
          start: d.employmentStart,
          end: d.employmentEnd,
          departmentId: department?.id,
        },
      };
      return await prisma.employment.create(createArgs);
    })
  );
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
