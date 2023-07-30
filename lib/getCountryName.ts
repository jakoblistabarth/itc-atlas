import { NeCountriesTopoJson } from "../types/NeTopoJson";

const getCountryName = (isoCode: string, countries: NeCountriesTopoJson) => {
  const country = countries.objects.ne_admin_0_countries.geometries
    .map((d) => d.properties)
    .find((d) => d?.ADM0_A3_NL === isoCode);
  return country ? country.NAME_EN : `${isoCode} (no matching country)`;
};

export default getCountryName;
