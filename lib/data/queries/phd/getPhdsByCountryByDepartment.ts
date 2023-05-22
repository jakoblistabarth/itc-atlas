import { group, geoCentroid, descending } from "d3";
import getCountries from "../../getCountries";
import * as topojson from "topojson-client";
import { pieDatum } from "../../../../components/map/ScaledPie";
import prisma from "../../../../prisma/client";

export type phdPerCountryDepartment = {
  countryId: number;
  departmentMainCode: string;
  count: number;
};

const getPhdsByCountryByDepartment = async (
  onlyGraduates?: Boolean // TODO: refactor
) => {
  const filter = onlyGraduates ? { status: { id: { equals: "38" } } } : {};
  const phdsGrouped = await prisma.phd.groupBy({
    by: ["countryId", "departmentMainId"],
    _count: {
      _all: true,
    },
    where: filter,
    orderBy: { countryId: "asc" },
  });
  const countries = await prisma.country.findMany();

  const phdCount = phdsGrouped.map((d) => {
    const c = countries.find((c) => c.id == d.countryId);
    return {
      countryIsoAlpha3: c?.isoAlpha3,
      countryName: c?.nameLongEn,
      departmentMainCode: d.departmentMainId,
      count: d._count._all,
    };
  });
  const count = group(phdCount, (d) => d.countryIsoAlpha3);

  // TODO: replace by getCountriesCentroids()
  const neCountriesTopojson = getCountries();
  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.ne_admin_0_countries
  );

  const countriesWithDepartments = neCountriesGeoJson.features
    .reduce(
      (
        acc: {
          isoAlpha3: string;
          countryName: string;
          departments: pieDatum[];
          totalCount: number;
          coordinates: number[];
        }[],
        feature
      ) => {
        const departmentCount = count.get(feature.properties?.ADM0_A3_NL);
        if (!departmentCount) return acc;
        const departments = departmentCount.map((d) => {
          return {
            label: d.departmentMainCode ?? "NA",
            value: d.count,
          };
        });
        const totalCount = departmentCount.reduce((sum, d) => sum + d.count, 0);
        const c = geoCentroid(feature);
        const coordinates = [c[0], c[1]];
        acc.push({
          isoAlpha3: feature.properties?.ADM0_A3_NL,
          countryName: departmentCount[0].countryName ?? "",
          departments,
          totalCount,
          coordinates,
        });
        return acc;
      },
      []
    )
    .sort((a, b) => descending(a.totalCount ?? 0, b.totalCount ?? 0));

  return countriesWithDepartments;
};

export default getPhdsByCountryByDepartment;