import { PrismaClient } from "@prisma/client";

export default async function getProjects() {
  const prisma = new PrismaClient();
  return await prisma.project.findMany();
}
