import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

//TODO add filter for status
const getCountryWithApplicantCount = async (
  level?: string,
  department?: string,
) => {
  const levelFilter = level
    ? {
        equals: level,
      }
    : {};
  const departmentFilter = department
    ? {
        some: {
          id: {
            equals: department,
          },
        },
      }
    : {};
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: {
          applicants: {
            where: {
              applications: {
                some: {
                  level: levelFilter,
                  status: {
                    id: {
                      equals: "38",
                    },
                  },
                  departments: departmentFilter,
                },
              },
            },
          },
          phds: {
            where: {
              departmentsMain: departmentFilter,
              AND: [
                {
                  dissertationNumber: {
                    gte: 1,
                  },
                },
                {
                  dissertationNumber: {
                    lte: 452,
                  },
                },
              ],
            },
          },
        },
      },
    },
  });
};

export type CountryWithApplicantCount = Prisma.PromiseReturnType<
  typeof getCountryWithApplicantCount
>;

export default getCountryWithApplicantCount;
