import { group } from "d3";
import prisma from "../../../../prisma/client";

type QueryRow = {
  country: string;
  departmentId: string;
  count: number;
};

export default async function getBtorsGroupedByCountryByDepartment() {
  const rows: QueryRow[] = await prisma.$queryRaw`
  SELECT
	  "Country"."isoAlpha3" as "country",
	  "Btor"."departmentId",
	  CAST(COUNT(*) as INT)
  FROM "Btor"
  INNER JOIN "_BtorToCountry" ON "_BtorToCountry"."A" = "Btor".id
  INNER JOIN "Country" ON "_BtorToCountry"."B" = "Country".id
  GROUP BY "Btor"."departmentId", "Country"."isoAlpha3"
  ORDER BY "Country"."isoAlpha3"
  `;

  const rowMap = group(rows, (d) => d.departmentId);
  return rowMap;
}

export type BtorsGroupedByCountryByDepartment = Awaited<
  ReturnType<typeof getBtorsGroupedByCountryByDepartment>
>;
