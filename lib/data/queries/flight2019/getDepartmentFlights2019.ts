import prisma from "../../../../prisma/client";

export default async function getDepartmentFlights2019(departmentId: string) {
  return await prisma.flight2019.findMany({
    where: {
      departmentId: {
        equals: departmentId,
      },
    },
  });
}
