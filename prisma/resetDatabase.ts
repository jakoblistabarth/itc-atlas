import prisma from "./client";

const resetDatabase = async () => {
  await prisma.phd.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Phd_id_seq" RESTART WITH 1;`;
  await prisma.department.deleteMany({});
  await prisma.employment.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.applicant.deleteMany({});
  await prisma.status.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Project_id_seq" RESTART WITH 1;`;
  await prisma.btor.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Btor_id_seq" RESTART WITH 1;`;
  await prisma.flight2019.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Flight2019_id_seq" RESTART WITH 1;`;
  await prisma.country.deleteMany({});
  await prisma.$queryRaw`ALTER SEQUENCE IF EXISTS "Country_id_seq" RESTART WITH 1;`;
  console.log("Database reset. 🧹");
};

export default resetDatabase;
