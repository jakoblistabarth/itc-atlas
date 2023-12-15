import { descending, groups } from "d3";
import prisma from "../../../../prisma/client";
import getCentroidByIsoCode from "../../getCentroidByIsoCode";
import { Prisma } from "@prisma/client";

export type phdPerCountryDepartment = {
  countryId: number;
  departmentMainCode: string;
  count: number;
};

type Row = { departmentId: string; isoAlpha3: string; count: number };

const getPhdsByCountryByDepartment = async (
  onlyGraduates?: boolean, // TODO: refactor
) => {
  const filter = onlyGraduates
    ? Prisma.sql`AND "statusId" = '38'`
    : Prisma.empty;
  const rows = await prisma.$queryRaw<Row[]>`
  SELECT
    rel."A" as "departmentId",
    c."isoAlpha3" as "isoAlpha3",
    Count(*)::INT as count
  FROM "Phd" AS p
  LEFT JOIN "Country" AS c
  ON p."countryId" = c."id"
  RIGHT JOIN "_PhdDepartmentMain" AS rel
  ON p.id = rel."B"
  WHERE
    p."countryId" IS NOT NULL
    ${filter}
  GROUP BY "isoAlpha3", "departmentId"
  ORDER BY "isoAlpha3";
  `;

  const countriesWithDepartments = groups(rows, (d) => d.isoAlpha3)
    .map(([isoAlpha3, departments]) => {
      return {
        isoAlpha3,
        coordinates: getCentroidByIsoCode(isoAlpha3)?.toArray(),
        totalCount: departments.reduce((acc, d) => (acc += d.count), 0),
        departments: departments.map((d) => ({
          label: d.departmentId,
          value: d.count,
        })),
      };
    })
    .filter((d) => d.coordinates)
    .sort((a, b) => descending(a.totalCount ?? 0, b.totalCount ?? 0));

  return countriesWithDepartments;
};

export default getPhdsByCountryByDepartment;
