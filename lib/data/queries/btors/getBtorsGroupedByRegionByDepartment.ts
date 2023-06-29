import { group } from "d3";
import prisma from "../../../../prisma/client";

type QueryRow = {
  regionCode: string;
  departmentId: string;
  count: number;
};

export default async function getBtorsGroupedByRegionByDepartment() {
  const rows: QueryRow[] = await prisma.$queryRaw`
  SELECT
	  "Country"."unSubRegionCode" as "regionCode",
	  "Btor"."departmentId",
	  CAST(COUNT(*) as INT)
  FROM "Btor"
  INNER JOIN "_BtorToCountry" ON "_BtorToCountry"."A" = "Btor".id
  INNER JOIN "Country" ON "_BtorToCountry"."B" = "Country".id
  GROUP BY "Btor"."departmentId", "Country"."unSubRegionCode"
  ORDER BY "Country"."unSubRegionCode"
  `;

  const rowMap = group(rows, (d) => d.regionCode);
  return rowMap;
}

export type BtorsGroupedByRegionByDepartment = Awaited<
  ReturnType<typeof getBtorsGroupedByRegionByDepartment>
>;
