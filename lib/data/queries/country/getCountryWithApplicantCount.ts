import { Prisma, PrismaClient } from "@prisma/client";

//TODO add filter for status and level?
const getCountryWithApplicantCount = async () => {
  const prisma = new PrismaClient();
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: {
          applicants: {
            where: {
              application: {
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
