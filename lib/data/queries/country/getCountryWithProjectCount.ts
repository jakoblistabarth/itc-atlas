import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithProjectCount = async (departmentId?: string) => {
  const filter = departmentId
    ? {
        where: { departmentMainId: departmentId },
      }
    : true;
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      unRegionCode: true,
      _count: {
        select: { projects: filter },
      },
    },
  });
};

export type CountryWithProjectCount = Prisma.PromiseReturnType<
  typeof getCountryWithProjectCount
>;

export default getCountryWithProjectCount;
