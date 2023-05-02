import prisma from "../../../../prisma/client";

type Row = { year: number; isoAlpha3: string; count: number };

export default async function getBtorsGroupedByYear() {
  const rows: Row[] = await prisma.$queryRaw`
  SELECT
    "Btor".year,
	  "Country"."isoAlpha3",
	  CAST(COUNT(*) as INT)
  FROM "Btor"
  INNER JOIN "_BtorToCountry" ON "_BtorToCountry"."A" = "Btor".id
  INNER JOIN "Country" ON "_BtorToCountry"."B" = "Country".id
  GROUP BY "Btor".year, "Country"."isoAlpha3"
  `;

  return rows;
}

export type BtorsGroupedByYear = Awaited<
  ReturnType<typeof getBtorsGroupedByYear>
>;
