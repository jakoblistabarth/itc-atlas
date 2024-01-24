import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

export default async function getEmploymentExtent() {
  const emplymentExtent = await prisma.employment.aggregate({
    _min: {
      startYear: true,
    },
    _max: {
      startYear: true,
    },
  });
  return emplymentExtent;
}

export type EmploymentExtent = Prisma.PromiseReturnType<
  typeof getEmploymentExtent
>;
