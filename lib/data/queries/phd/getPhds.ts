import prisma from "../../../../prisma/client";

export default async function getPhds() {
  return await prisma.phd.findMany();
}
