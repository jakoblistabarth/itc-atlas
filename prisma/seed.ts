import { Prisma, PrismaClient } from "@prisma/client";
import getDepartments from "../lib/data/getDepartments";
import getPhdCandidates from "../lib/data/getPhdCandidates";
import getUnsdCountries from "../lib/data/getUnsdCountries";

const prisma = new PrismaClient();

async function main() {
  const [departments, countries, phds] = await Promise.all([
    getDepartments(),
    getUnsdCountries(),
    getPhdCandidates(),
  ]);

  departments.forEach(async (d) => {
    const upsertArgs: Prisma.DepartmentUpsertArgs = {
      where: { code: d.code },
      update: {},
      create: {
        code: d.code,
        name: d.name,
      },
    };
    const department = await prisma.department.upsert(upsertArgs);
  });

  countries.forEach(async (d, idx) => {
    const upsertArgs: Prisma.CountryUpsertArgs = {
      where: { id: idx },
      update: {},
      create: {
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
    const country = await prisma.country.upsert(upsertArgs);
  });

  phds.forEach(async (d, idx) => {
    const country = await prisma.country.findFirst({
      select: { id: true },
      where: {
        IsoAlpha3: {
          equals: d.country ?? undefined,
        },
      },
    });

    const upsertArgs: Prisma.PhdCandidateUpsertArgs = {
      where: { id: idx },
      update: {},
      create: {
        id: idx,
        contactId: d.studentId,
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
    const phdCandidate = await prisma.phdCandidate.upsert(upsertArgs);
  });
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
