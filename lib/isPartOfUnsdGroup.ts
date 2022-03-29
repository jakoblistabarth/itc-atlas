import getUnsdCodes from "./getUnsdCodes";

type Group = "LDC" | "LLDC" | "SIDS";

// TODO: refactor to avoid parsing in codes
export default function isPartOfUnsdGroup(
  areaCodes,
  iso3Code: string,
  group: Group
) {
  //   const areaCodes = await getUnsdCodes("countries");
  const country = areaCodes.find((d) => d["ISO-alpha3 Code"] === iso3Code);
  if (!country) return;
  return country["Least Developed Countries (LDC)"] === "x";
}
