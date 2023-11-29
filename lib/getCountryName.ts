import { Country } from "@prisma/client";

const getCountryName = (isoCode: string, countries: Country[]) => {
  const country = countries.find((d) => d?.isoAlpha3 === isoCode);
  return country ? country.nameLongEn : `${isoCode} (no matching country)`;
};

export default getCountryName;
