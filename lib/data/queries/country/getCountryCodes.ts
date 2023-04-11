import prisma from "../../../../prisma/client";

export default async function getCountryCodes() {
  return await prisma.country.findMany();
}
