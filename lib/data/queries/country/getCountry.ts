import prisma from "../../../../prisma/client";

export default async function getCountry(isoAlpha3: string) {
  return await prisma.country.findFirstOrThrow({
    where: {
      isoAlpha3: {
        equals: isoAlpha3,
      },
    },
  });
}
