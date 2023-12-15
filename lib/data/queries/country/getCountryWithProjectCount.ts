import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithProjectCount = async (departmentId?: string) => {
  const departmentFilter = departmentId
    ? { departmentsMain: { some: { id: departmentId } } }
    : undefined;
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      unRegionCode: true,
      _count: {
        select: {
          projects: {
            where: {
              ...departmentFilter,
              status: "Completed",
            },
          },
        },
      },
    },
    where: {
      projects: {
        some: { status: "Completed" },
      },
    },
  });
};

export type CountryWithProjectCount = Prisma.PromiseReturnType<
  typeof getCountryWithProjectCount
>;

export default getCountryWithProjectCount;
