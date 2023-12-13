import prisma from "../../../../prisma/client";

export default async function getFlights2019(...args: string[]) {
  return args.length > 0
    ? await prisma.flight2019.findMany({
        where: {
          departmentId: {
            equals: args[0],
          },
        },
      })
    : await prisma.flight2019.findMany();
}
