import prisma from "../../../../prisma/client";

export default async function getEmployees() {
  return await prisma.employee.findMany();
}
