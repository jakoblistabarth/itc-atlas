import { Prisma, PrismaClient } from "@prisma/client";

export default async function getProjectsWithCountries() {
  const prisma = new PrismaClient();
  return await prisma.project.findMany({
    include: {
      countries: true,
    },
  });
}

export type ProjectsWithCountries = Prisma.PromiseReturnType<
  typeof getProjectsWithCountries
>;
