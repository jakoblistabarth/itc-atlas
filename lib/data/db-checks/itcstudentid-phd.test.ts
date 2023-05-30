import prisma from "../../../prisma/client";
import { describe, test, expect } from "@jest/globals";

describe("Phds match with applicants in", () => {
  test("709 cases", async () => {
    const phdsWithApplicant = await prisma.phd.count({
      where: {
        applicant: {
          isNot: null,
        },
      },
    });
    expect(phdsWithApplicant).toBe(709);
  });
});

describe("Applicants match with phds in", () => {
  test("700 cases", async () => {
    const applicantsWithPhd = await prisma.applicant.count({
      where: {
        phds: { some: {} },
      },
    });
    expect(applicantsWithPhd).toBe(700);
  });
});

describe("One female applicant from Greece born in 1980", () => {
  test("matches with 2 phd applications ", async () => {
    const applicant = await prisma.applicant.findFirst({
      include: { phds: true, country: true },
      where: {
        country: {
          isoAlpha3: "GRC",
        },
        gender: "f",
        yearOfBirth: 1980,
        phds: { some: {} },
      },
    });
    expect(applicant?.phds.length).toBe(2);
    expect(applicant?.phds[0].thesisTitle).toBe(
      "Time series analysis of remotely-sensed TIR emission: linking anomalies to physical processes"
    );
  });
});

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
