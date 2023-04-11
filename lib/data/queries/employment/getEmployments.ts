import prisma from "../../../../prisma/client";

export default async function getEmployments() {
  return await prisma.employment.findMany();
}
