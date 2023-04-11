import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

export default async function getBtorsByCountry(isoAlpha3: string) {
  return await prisma.btor.findMany({
    include: {
      countries: {
        select: {
          isoAlpha3: true,
        },
      },
      department: {
        select: {
          id: true,
        },
      },
    },
    where: {
      countries: {
        some: {
          isoAlpha3: {
            equals: isoAlpha3,
          },
        },
      },
    },
  });
}

export type BtorsByCountry = Prisma.PromiseReturnType<typeof getBtorsByCountry>;
