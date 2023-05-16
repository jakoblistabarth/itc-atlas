import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

export default async function getApplicationLevels() {
  const applicants = await prisma.application.findMany({
    select: {
      level: true,
    },
    where: {
      NOT: {
        level: {
          equals: null,
        },
      },
    },
    distinct: ["level"],
  });
  return applicants;
}

export type ApplicationLevels = Prisma.PromiseReturnType<
  typeof getApplicationLevels
>;
