import { Prisma, PrismaClient } from "@prisma/client";

const getCountryWithEmployeeCount = async () => {
  const prisma = new PrismaClient();
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: { employees: true },
      },
    },
  });
};

export type CountryWithEmployeeCount = Prisma.PromiseReturnType<
  typeof getCountryWithEmployeeCount
>;

export default getCountryWithEmployeeCount;
