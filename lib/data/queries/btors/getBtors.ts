import { Prisma, PrismaClient } from "@prisma/client";

export default async function getBtorsWithRelations() {
  const prisma = new PrismaClient();
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
