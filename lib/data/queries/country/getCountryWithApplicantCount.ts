import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

//TODO add filter for status and level?
const getCountryWithApplicantCount = async () => {
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: {
          applicants: {
            where: {
              applications: {
                some: {
                  level: {
                    equals: "MSC",
                  },
                  status: {
                    id: {
                      equals: "38",
                    },
                  },
                },
              },
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
