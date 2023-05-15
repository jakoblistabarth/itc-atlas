import { group } from "d3";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { Country } from "@prisma/client";
import { merge } from "topojson-client";
import { Feature, MultiPolygon } from "geojson";

const getUnRegions = (
  countryCodes: Country[],
  neCountries: NeCountriesTopoJson,
  regionType:
    | "unRegionCode"
    | "unSubRegionCode"
    | "unIntermediateRegionCode" = "unSubRegionCode"
) => {
  const regionMap = group(countryCodes, (d) => d[regionType] ?? "");
  return Array.from(regionMap.entries()).map(([region, d]) => {
    const isoCodes = d.map((d) => d.isoAlpha3);
    const geometry = merge(
      neCountries,
      neCountries.objects.ne_admin_0_countries.geometries.filter((geometry) =>
        isoCodes.includes(geometry.properties?.ADM0_A3 ?? "")
      )
    );
    const feature: Feature<MultiPolygon, { region: string }> = {
      type: "Feature",
      properties: {
        region,
      },
      geometry,
    };
    return feature;
  });
};

export default getUnRegions;
