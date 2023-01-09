import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allPhDCandidates = await prisma.phdCandidate.findMany({
    where: {
      departmentMain: {
        is: {
          name: "Department of Applied Earth Sciences",
        },
      },
      country: {
        isNot: {
          NameLongEn: "Albania",
        },
      },
    },
    select: {
      thesisTitle: true,
      country: {
        select: {
          IsoAlpha3: true,
          NameLongEn: true,
        },
      },
    },
    take: 2,
  });
  console.log(allPhDCandidates);
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
