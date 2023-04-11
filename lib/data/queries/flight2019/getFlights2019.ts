import prisma from "../../../../prisma/client";

export default async function getFlights2019() {
  return await prisma.flight2019.findMany();
}
