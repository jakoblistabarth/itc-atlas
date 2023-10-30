import prisma from "../../../../prisma/client";

export default async function getDepartments(scientific = false) {
  const filter = scientific
    ? {
        where: {
          number: {
            not: null,
          },
        },
      }
    : undefined;
  return await prisma.department.findMany(filter);
}
