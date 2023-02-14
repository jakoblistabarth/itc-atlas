import { PrismaClient } from "@prisma/client";

export default async function getEmployees() {
  const prisma = new PrismaClient();
  return await prisma.employee.findMany();
}
