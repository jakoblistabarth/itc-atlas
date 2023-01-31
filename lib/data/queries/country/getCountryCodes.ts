import { PrismaClient } from "@prisma/client";

export default async function getCountryCodes() {
  const prisma = new PrismaClient();
  return await prisma.country.findMany();
}
