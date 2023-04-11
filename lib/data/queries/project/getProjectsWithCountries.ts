import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

export default async function getProjectsWithCountries() {
  return await prisma.project.findMany({
    include: {
      countries: true,
    },
  });
}

export type ProjectsWithCountries = Prisma.PromiseReturnType<
  typeof getProjectsWithCountries
>;
