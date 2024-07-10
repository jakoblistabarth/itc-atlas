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
      AND: [
        {
          dissertationNumber: {
            gte: 1,
          },
        },
        {
          dissertationNumber: {
            lte: 452,
          },
        },
      ],
    },
  });
};

export type PhdTheses = Prisma.PromiseReturnType<typeof getPhdTheses>;

export default getPhdTheses;
