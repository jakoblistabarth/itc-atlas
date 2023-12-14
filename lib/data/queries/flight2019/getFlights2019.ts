import prisma from "../../../../prisma/client";

export default async function getFlights2019(departmentId?: string) {
  const filter = departmentId
    ? {
        departmentId: {
          equals: departmentId,
        },
      }
    : undefined;

  return await prisma.flight2019.findMany({
    where: filter,
  });
}
