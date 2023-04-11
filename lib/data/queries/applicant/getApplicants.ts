import prisma from "../../../../prisma/client";

export default async function getApplicants() {
  return await prisma.applicant.findMany();
}
