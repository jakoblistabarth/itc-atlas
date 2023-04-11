import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithProjectCount = async () => {
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
