import { PrismaClient } from "@prisma/client";

export default async function getApplicants() {
  const prisma = new PrismaClient();
  return await prisma.applicant.findMany();
}
