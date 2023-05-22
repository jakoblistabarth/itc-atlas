import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getCountryWithPhdCount = async () => {
  return prisma.country.findMany({
    select: {
      isoAlpha3: true,
      _count: {
        select: { phds: true },
      },
    },
  });
};

export type CountryWithPhdCount = Prisma.PromiseReturnType<
  typeof getCountryWithPhdCount
>;

export default getCountryWithPhdCount;
