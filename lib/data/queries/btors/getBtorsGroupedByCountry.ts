import prisma from "../../../../prisma/client";
import * as aq from "arquero";

type Row = { id: string; year: number; countries: string[] };

export default async function getBtorsGroupedByCountry() {
  const rows: Row[] = await prisma.$queryRaw`
  SELECT
    "Btor".id,
    "Btor".year, 
    ARRAY_AGG("Country"."isoAlpha3") as countries
  FROM "Btor"
  INNER JOIN "_BtorToCountry" ON "_BtorToCountry"."A" = "Btor".id
  INNER JOIN "Country" ON "_BtorToCountry"."B" = "Country".id
  GROUP BY "Btor".id
  `;

  const grouped = aq
    .from(rows)
    .filter((d: Row) => d.countries.length > 1)
    .groupby("countries")
    .count()
    .objects() as (Row & { count: number })[];

  return grouped.map((d, i) => {
    return {
      id: i,
      countries: d.countries,
      count: d.count,
    };
  });
}

export type BtorsGroupedByCountry = Awaited<
  ReturnType<typeof getBtorsGroupedByCountry>
>;
