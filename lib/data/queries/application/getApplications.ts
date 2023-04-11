import prisma from "../../../../prisma/client";

export default async function getApplicants() {
  const applicants = await prisma.application.findMany();
  return applicants;
}
