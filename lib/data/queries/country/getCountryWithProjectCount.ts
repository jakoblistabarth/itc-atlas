import { Prisma, PrismaClient } from "@prisma/client";

const getCountryWithProjectCount = async () => {
  const prisma = new PrismaClient();
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      unRegionCode: true,
      _count: {
        select: { projects: true },
      },
    },
  });
};

export type CountryWithProjectCount = Prisma.PromiseReturnType<
  typeof getCountryWithProjectCount
>;

export default getCountryWithProjectCount;
