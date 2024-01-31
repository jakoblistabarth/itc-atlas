import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";

const getMscApplicationsByProgramByYear = async (
  program: string,
  year: number,
) => {
  return prisma.application.groupBy({
    by: ["examYear"],
    _count: {
      _all: true,
    },
    where: {
      status: {
        label: {
          equals: "Alumnus",
        },
      },
      level: "Master",
      programmId: program,
      examYear: year,
    },
  });
};

export type MscApplicationsByProgramByYearWithCount = Prisma.PromiseReturnType<
  typeof getMscApplicationsByProgramByYear
>;

export default getMscApplicationsByProgramByYear;
