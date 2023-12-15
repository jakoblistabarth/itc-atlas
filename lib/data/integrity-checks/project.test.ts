import prisma from "../../../prisma/client";
import { describe, test, expect } from "@jest/globals";

describe("Projects have one or more secondary departments", () => {
  test("in 144 cases.", async () => {
    const projects = await prisma.project.findMany({
      include: {
        departmentsSecondary: true,
      },
    });
    const projectsWithSecondaryDepartment = projects.filter(
      (d) => d.departmentsSecondary.length > 0,
    );

    expect(projectsWithSecondaryDepartment.length).toBe(144);
  });

  test("which are all different from their main department.", async () => {
    const projects = await prisma.project.findMany({
      include: {
        departmentsMain: true,
        departmentsSecondary: true,
      },
    });
    const projectsHaveRedundantSecondaryDepartments = projects.some(
      (project) =>
        project.departmentsMain &&
        project.departmentsSecondary.some((d) =>
          project.departmentsMain.map((d) => d.id).includes(d.id),
        ),
    );

    expect(projectsHaveRedundantSecondaryDepartments).toBe(false);
  });
});
