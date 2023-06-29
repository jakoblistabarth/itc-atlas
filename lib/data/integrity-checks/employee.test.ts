import prisma from "../../../prisma/client";
import { describe, test, expect } from "@jest/globals";

describe("Applicants match with employees in", () => {
  test("583 cases", async () => {
    const applicantsWithEmployees = await prisma.applicant.count({
      where: {
        employees: { some: {} },
      },
    });
    expect(applicantsWithEmployees).toBe(583);
  });
});

describe("Employees match with applicants in", () => {
  test("587 cases", async () => {
    const employeesWithApplicants = await prisma.employee.count({
      where: {
        applicant: { isNot: null },
      },
    });
    expect(employeesWithApplicants).toBe(587);
  });
});

describe("A employee from Portgul born in 1987", () => {
  test("is related to 5 employments", async () => {
    const employee = await prisma.employee.findFirst({
      where: {
        yearOfBirth: {
          equals: 1987,
        },
        country: {
          isoAlpha3: {
            equals: "PRT",
          },
        },
      },
      include: {
        employment: true,
      },
    });
    expect(employee?.employment.length).toBe(5);
  });
});

describe("A employee from Indonesia born in 1983", () => {
  test("is related to 6 employments", async () => {
    const employee = await prisma.employee.findFirst({
      where: {
        yearOfBirth: {
          equals: 1983,
        },
        country: {
          isoAlpha3: {
            equals: "IDN",
          },
        },
      },
      include: {
        employment: true,
      },
    });
    expect(employee?.employment.length).toBe(6);
  });
});
