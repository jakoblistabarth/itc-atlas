import prisma from "../../../../prisma/client";

export default async function getProjects() {
  return await prisma.project.findMany();
}
