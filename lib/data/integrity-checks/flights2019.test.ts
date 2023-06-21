import prisma from "../../../prisma/client";
import { describe, test, expect } from "@jest/globals";

describe("In 2019 there have been", () => {
  test("899 flights.", async () => {
    const rows = await prisma.flight2019.count();
    expect(rows).toBe(899);
  });

  test("360 flights related to projects", async () => {
    const flights = await prisma.flight2019.count({
      where: {
        type: {
          equals: "ProjectRelated",
        },
      },
    });
    expect(flights).toBe(360);
  });

  test("87 flights allocated to the AES department.", async () => {
    const flightsAES = await prisma.flight2019.count({
      where: {
        department: {
          id: {
            equals: "AES",
          },
        },
      },
    });
    expect(flightsAES).toBe(87);
  });
});
