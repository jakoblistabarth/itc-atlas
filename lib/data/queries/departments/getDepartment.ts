import prisma from "../../../../prisma/client";

export default async function getDepartment(id: string) {
  return await prisma.department.findFirstOrThrow({
    select: {
      id: true,
      name: true,
      number: true,
      projectMain: {
        include: {
          countries: true,
        },
        where: {
          status: {
            equals: "Completed",
          },
        },
      },
      phdsMain: {
        select: {
          id: true,
          thesisTitle: true,
          promotionYear: true,
          departmentMainId: true,
          departmentSecondaryId: true,
          graduationYear: true,
          doi: true,
          name: true,
          country: {
            select: {
              isoAlpha3: true,
            },
          },
        },
        where: {
          status: {
            label: {
              equals: "Alumnus",
            },
          },
          OR: [
            {
              graduationYear: {
                not: null,
              },
            },
            {
              promotionYear: {
                not: null,
              },
            },
          ],
        },
      },
      phdsSecondary: {
        select: {
          id: true,
        },
        where: {
          status: {
            label: {
              equals: "Alumnus",
            },
          },
          OR: [
            {
              graduationYear: {
                not: null,
              },
            },
            {
              promotionYear: {
                not: null,
              },
            },
          ],
        },
      },
    },
    where: {
      id: {
        equals: id,
      },
    },
  });
}
