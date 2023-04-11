import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

export default async function getBtorsWithRelations() {
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
  });
}

export type BtorsWithRelations = Prisma.PromiseReturnType<
  typeof getBtorsWithRelations
>;
