import { Prisma, PrismaClient } from "@prisma/client";

const getCountryWithPhdCandidateCount = async () => {
  const prisma = new PrismaClient();
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: { phdCandidates: true },
      },
    },
  });
};

export type CountryWithPhdCandidateCount = Prisma.PromiseReturnType<
  typeof getCountryWithPhdCandidateCount
>;

export default getCountryWithPhdCandidateCount;
