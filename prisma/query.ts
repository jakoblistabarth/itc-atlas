import prisma from "./client";

async function main() {
  const res = await prisma.phd.findMany({
    where: {
      departmentsMain: {
        some: {
          name: "Department of Applied Earth Sciences",
        },
      },
      country: {
        isNot: {
          nameLongEn: "Albania",
        },
      },
    },
    select: {
      thesisTitle: true,
      country: {
        select: {
          isoAlpha3: true,
          nameLongEn: true,
        },
      },
    },
    take: 2,
  });
  console.log(res);
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
