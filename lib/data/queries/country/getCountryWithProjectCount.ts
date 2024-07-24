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
              OR: [
                { ...departmentFilter, status: "Completed" },
                {
                  AND: {
                    ...departmentFilter,
                    status: {
                      equals: "Ongoing",
                    },
                    end: {
                      lte: new Date("2024-07-24"),
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    where: {
      projects: {
        some: { OR: [{ status: "Completed" }, { status: "Ongoing" }] },
      },
    },
  });
};

export type CountryWithProjectCount = Prisma.PromiseReturnType<
  typeof getCountryWithProjectCount
>;

export default getCountryWithProjectCount;
