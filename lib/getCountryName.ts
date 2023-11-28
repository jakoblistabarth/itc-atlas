import { NeCountriesTopoJson } from "../types/NeTopoJson";

const getCountryName = (isoCode: string, countries: NeCountriesTopoJson) => {
  switch (isoCode) {
    case "GIB": {
      return "Gibraltar";
      break;
    }
    case "SJM": {
      return "Svalbard and Jan Mayen";
      break;
    }
    case "REU": {
      return "Réunion";
      break;
    }
  }
  const country = countries.objects.ne_admin_0_countries.geometries
    .map((d) => d.properties)
    .find((d) => d?.ADM0_A3_NL === isoCode || d?.ISO_A3 == isoCode);
  return country ? country.NAME_EN : `${isoCode} (no matching country)`;
};

export default getCountryName;
