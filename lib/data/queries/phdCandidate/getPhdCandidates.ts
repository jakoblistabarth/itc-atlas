import { PrismaClient } from "@prisma/client";

export default async function getPhdCandidates() {
  const prisma = new PrismaClient();
  return await prisma.phdCandidate.findMany();
}
