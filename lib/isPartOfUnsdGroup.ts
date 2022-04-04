import { UnGroupings } from "../types/UnGroupings";
import getUnsdCodes from "./getUnsdCodes";

// TODO: refactor to avoid parsing in codes
export default function isPartOfUnsdGroup(
  areaCodes,
  iso3Code: string,
  group: UnGroupings
) {
  // const areaCodes = await getUnsdCodes("countries");
  const country = areaCodes.find(
    (area) => area["ISO-alpha3 Code"] === iso3Code
  );
  if (!country) return;
  return country["Least Developed Countries (LDC)"] === "x";
}
