import prisma from "../../../../prisma/client";

export default async function getPhdCandidates() {
  return await prisma.phdCandidate.findMany();
}
