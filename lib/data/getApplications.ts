import { PrismaClient } from "@prisma/client";

export default async function getApplicants() {
  const prisma = new PrismaClient();
  const applicants = await prisma.application.findMany();
  return applicants;
}
