import prisma from "../../../prisma/client";
import { describe, test, expect } from "@jest/globals";

describe("Applications have", () => {
  test("0 unique (tailored to individuals) courseIds", async () => {
    const uniqueCourseIds = await prisma.application.groupBy({
      by: ["courseId"],
      _count: {
        _all: true,
      },
      where: {
        courseId: {
          // as all non-uniques should be replaced by uuids
          // which should not start with "C00"
          startsWith: "C00",
        },
      },
      having: {
        courseId: {
          _count: {
            equals: 1,
          },
        },
      },
    });
    expect(uniqueCourseIds.length).toBe(0);
  });
});
