import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

//TODO add filter for status and level?
const getPhdsByYear = async (isoAlpha3: string) => {
  return prisma.phd.groupBy({
    by: ["promotionYear"],
    _count: {
      _all: true,
    },
    where: {
      country: {
        isoAlpha3: {
          equals: isoAlpha3,
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

export type phdsByYearWithCount = Prisma.PromiseReturnType<
  typeof getPhdsByYear
>;

export default getPhdsByYear;
