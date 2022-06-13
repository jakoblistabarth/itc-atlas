import { AreaCode, UnGrouping } from "../types/UnsdCodes";

// TODO: refactor to avoid parsing in codes
export default function isPartOfUnsdGroup(
  areaCodes: AreaCode[],
  iso3Code: string,
  group: UnGrouping
) {
  const country = areaCodes.find(
    (area) => area["ISO-alpha3 Code"] === iso3Code
  );
  if (!country) return;
  return country[group];
}
