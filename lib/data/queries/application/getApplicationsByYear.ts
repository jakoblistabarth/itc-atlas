import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";

//TODO add filter for status and level?
const getApplicationsByYear = async (isoAlpha3: string) => {
  return prisma.application.groupBy({
    by: ["examYear"],
    _count: {
      _all: true,
    },
    where: {
      applicant: {
        country: {
          isoAlpha3: {
            equals: isoAlpha3,
          },
        },
      },
      status: {
        id: {
          equals: "38",
        },
      },
    },
  });
};

export type ApplicationByYearWithCount = Prisma.PromiseReturnType<
  typeof getApplicationsByYear
>;

export default getApplicationsByYear;
