import { PrismaClient } from "@prisma/client";

export default async function getEmployments() {
  const prisma = new PrismaClient();
  return await prisma.employment.findMany();
}
