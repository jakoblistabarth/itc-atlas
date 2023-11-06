import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  //@ts-expect-error invalid typing
  if (!global.prisma) {
    //@ts-expect-error invalid typing
    global.prisma = new PrismaClient();
  }

  //@ts-expect-error invalid typing
  prisma = global.prisma;
}

export default prisma as PrismaClient;
