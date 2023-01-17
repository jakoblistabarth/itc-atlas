import { Prisma, PrismaClient } from "@prisma/client";
import getDepartments from "../lib/data/getDepartments";
import getPhdCandidates from "../lib/data/getPhdCandidates";
import getUnsdCountries from "../lib/data/getUnsdCountries";
import getContacts from "../lib/data/getContacts";

const prisma = new PrismaClient();

async function main() {
  await prisma.phdCandidate.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "PhdCandidate_id_seq" RESTART WITH 1;`;
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Country_id_seq" RESTART WITH 1;`;

  const [departments, countries, phds, contacts] = await Promise.all([
    getDepartments(),
    getUnsdCountries(),
    getPhdCandidates(),
    getContacts(),
  ]);

  await Promise.all(
    departments.map(async (d) => {
      const createArgs: Prisma.DepartmentCreateArgs = {
        data: {
          code: d.code,
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
          IsoAlpha2: d["ISO-alpha2 Code"],
          IsoAlpha3: d["ISO-alpha3 Code"],
          IsoNum3: d["M49 Code"],
          NameEn: undefined,
          NameLongEn: d["Country or Area"],
          UnRegionCode: d["Region Code"],
          UnSubRegionCode: d["Sub-region Code"],
          UnIntermediateRegionCode: d["Intermediate Region Code"]
            ? d["Intermediate Region Code"]
            : undefined,
          Ldc: d["Least Developed Countries (LDC)"] ? true : false,
          Lldc: d["Land Locked Developing Countries (LLDC)"] ? true : false,
          Sids: d["Small Island Developing States (SIDS)"] ? true : false,
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
              IsoAlpha3: {
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
              IsoAlpha3: {
                equals: d.country ?? undefined,
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
          departmentMainCode: d.department1,
          departmentSecondaryCode: d.department2,
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
