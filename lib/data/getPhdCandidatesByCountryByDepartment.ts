import { group, geoCentroid, descending, min, max } from "d3";
import getCountries from "./getCountries";
import getPhdCandidates from "./getPhdCandidates";
import type { FeatureCollection, Feature, Point } from "geojson";
import * as topojson from "topojson-client";
import { Department, departmentColors } from "../mappings/departments";
import { pieDatum } from "../../components/map/ScaledPie";

const getPhdCandidatesByCountryByDepartment = async () => {
  const neCountriesTopojson = getCountries();
  const [phdCandidates] = await Promise.all([getPhdCandidates()]);

  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.ne_admin_0_countries
  );

  const count = group(
    phdCandidates,
    (d) => d.country,
    (d) => d.department1
  );

  const data: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: neCountriesGeoJson.features
      .map((feature) => {
        const departments = count.get(feature.properties?.ADM0_A3_NL);
        const departmentCount = departments
          ? Array.from(departments?.entries()).map(([key, value]) => {
              return {
                label: key,
                value: value.length,
              };
            })
          : null;
        const totalCount = departments
          ? Array.from(departments.values()).reduce(
              (sum, d) => sum + d.length,
              0
            )
          : null;
        const pointFeature: Feature<Point> = {
          type: "Feature",
          properties: {
            totalPhdCount: totalCount,
            departments: departmentCount,
            ...feature.properties,
          },
          geometry: {
            type: "Point",
            coordinates: [geoCentroid(feature)[0], geoCentroid(feature)[1]],
          },
        };
        return pointFeature;
      })
      .filter((feature: Feature) => feature.properties?.totalPhdCount)
      .sort((a: Feature, b: Feature) =>
        descending(a.properties?.totalPhdCount, b.properties?.totalPhdCount)
      ),
  };

  const legendEntries = data.features
    .reduce((acc: Department[], point) => {
      point.properties?.departments.forEach((department: pieDatum) => {
        if (!acc.includes(department.label as Department))
          acc.push(department.label as Department);
      });
      return acc;
    }, [])
    .map((department) => {
      return {
        label: department,
        color: departmentColors[department],
      };
    });

  const phdCount = Array.from(count.values()).map((d) =>
    Array.from(d.values()).reduce((sum, d) => sum + d.length, 0)
  );
  const minCount = min(phdCount) ?? 0;
  const maxCount = max(phdCount) ?? 10;
  const domain: [number, number] = [minCount, maxCount];

  return { data, domain, legendEntries };
};

export default getPhdCandidatesByCountryByDepartment;
