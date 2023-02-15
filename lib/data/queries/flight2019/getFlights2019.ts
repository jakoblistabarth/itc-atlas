import { PrismaClient } from "@prisma/client";

export default async function getFlights2019() {
  const prisma = new PrismaClient();
  return await prisma.flight2019.findMany();
}
