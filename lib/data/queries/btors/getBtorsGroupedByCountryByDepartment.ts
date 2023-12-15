import { group } from "d3";
import prisma from "../../../../prisma/client";

type Row = {
  isoAlpha3: string;
  departmentId: string;
  count: number;
};

export default async function getBtorsGroupedByCountryByDepartment() {
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT
      "Country"."isoAlpha3" AS "isoAlpha3",
      "_BtorToDepartment"."B" AS "departmentId",
      COUNT(*)::INT
    FROM "Btor"
    INNER JOIN "_BtorToCountry"
      ON "_BtorToCountry"."A" = "Btor".id
    INNER JOIN "Country"
      ON "_BtorToCountry"."B" = "Country".id
    INNER JOIN "_BtorToDepartment"
      ON "_BtorToDepartment"."A" = "Btor".id
    GROUP BY
      "departmentId",
      "isoAlpha3"
    ORDER BY "Country"."isoAlpha3"
  `;

  const rowMap = group(rows, (d) => d.departmentId);
  return rowMap;
}

export type BtorsGroupedByCountryByDepartment = Awaited<
  ReturnType<typeof getBtorsGroupedByCountryByDepartment>
>;
