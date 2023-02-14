import { Prisma, PrismaClient } from "@prisma/client";

//TODO add filter for status and level?
const getPhdCandidatesByYear = async (isoAlpha3: string) => {
  const prisma = new PrismaClient();
  return prisma.phdCandidate.groupBy({
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

export type phdCandidateByYearWithCount = Prisma.PromiseReturnType<
  typeof getPhdCandidatesByYear
>;

export default getPhdCandidatesByYear;
