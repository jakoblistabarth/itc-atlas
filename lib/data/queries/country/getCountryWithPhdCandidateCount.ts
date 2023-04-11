import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithPhdCandidateCount = async () => {
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: { phdCandidates: true },
      },
    },
  });
};

export type CountryWithPhdCandidateCount = Prisma.PromiseReturnType<
  typeof getCountryWithPhdCandidateCount
>;

export default getCountryWithPhdCandidateCount;
