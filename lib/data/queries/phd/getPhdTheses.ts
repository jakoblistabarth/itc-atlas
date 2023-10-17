import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getPhdTheses = async () => {
  return prisma.phd.findMany({
    select: {
      thesisTitle: true,
      startYear: true,
      graduationYear: true,
      promotionYear: true,
      departmentMainId: true,
      departmentSecondaryId: true,
      country: {
        select: {
          isoAlpha3: true,
        },
      },
    },
    where: {
      status: {
        label: {
          equals: "Alumnus",
        },
      },
      OR: [
        {
          graduationYear: {
            not: null,
          },
        },
        {
          promotionYear: {
            not: null,
          },
        },
      ],
    },
  });
};

export type PhdTheses = Prisma.PromiseReturnType<typeof getPhdTheses>;

export default getPhdTheses;
