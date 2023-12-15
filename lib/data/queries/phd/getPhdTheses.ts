import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";

const getPhdTheses = async () => {
  return prisma.phd.findMany({
    select: {
      id: true,
      thesisTitle: true,
      promotionYear: true,
      departmentsMain: true,
      departmentsSecondary: true,
      graduationYear: true,
      country: {
        select: {
          isoAlpha3: true,
        },
      },
      doi: true,
      name: true,
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
