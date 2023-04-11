import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithEmployeeCount = async () => {
  return prisma.country.findMany({
    select: {
      nameLongEn: true,
      isoAlpha3: true,
      _count: {
        select: { employees: true },
      },
    },
    where: {
      NOT: {
        employees: {
          none: {},
        },
      },
    },
  });
};

export type CountryWithEmployeeCount = Prisma.PromiseReturnType<
  typeof getCountryWithEmployeeCount
>;

export default getCountryWithEmployeeCount;
