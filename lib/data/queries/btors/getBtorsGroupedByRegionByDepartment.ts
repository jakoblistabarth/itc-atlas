import { group } from "d3";
import prisma from "../../../../prisma/client";

type Row = {
  regionCode: string;
  departmentId: string;
  count: number;
};

export default async function getBtorsGroupedByRegionByDepartment() {
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT
      "Country"."unSubRegionCode" AS "regionCode",
      "_BtorToDepartment"."B" AS "departmentId",
      COUNT(*)::INT
    FROM "Btor"
    INNER JOIN "_BtorToCountry" ON "_BtorToCountry"."A" = "Btor".id
    INNER JOIN "Country" ON "_BtorToCountry"."B" = "Country".id
    INNER JOIN "_BtorToDepartment"
      ON "_BtorToDepartment"."A" = "Btor".id
    GROUP BY "departmentId", "Country"."unSubRegionCode"
    ORDER BY "Country"."unSubRegionCode"
  `;

  const rowMap = group(rows, (d) => d.regionCode);
  return rowMap;
}

export type BtorsGroupedByRegionByDepartment = Awaited<
  ReturnType<typeof getBtorsGroupedByRegionByDepartment>
>;
