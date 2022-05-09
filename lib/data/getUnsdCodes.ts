import csv from "csvtojson";
import { AreaCode, UnLevel } from "../../types/UnsdCodes";

export default async function getUnsdCodes(level: UnLevel) {
  const csvFilePath = "./data/UNSD-Methodology.csv";
  // source: https://unstats.un.org/unsd/methodology/m49/overview/
  const countries: AreaCode[] = await csv().fromFile(csvFilePath);

  const countryCodes = countries.map((d) => ({
    code: d["Region Code"],
    name: d["Country or Area"],
  }));

  const regions = Array.from(new Set(countries.map((d) => d["Region Code"])))
    .filter((d) => d)
    .map((d) => {
      const country = countries.find((e) => e["Region Code"] === d);
      return {
        code: d,
        name: country ? country["Region Name"] : null,
      };
    });

  const subRegions = Array.from(
    new Set(countries.map((d) => d["Sub-region Code"]))
  )
    .filter((d) => d)
    .map((d) => {
      const subRegion = countries.find((e) => e["Sub-region Code"] === d);
      return {
        code: d,
        name: subRegion ? subRegion["Sub-region Name"] : null,
      };
    });

  const intermediateRegions = Array.from(
    new Set(countries.map((d) => d["Intermediate Region Code"]))
  )
    .filter((d) => d)
    .map((d) => {
      const intermediateRegion = countries.find(
        (e) => e["Intermediate Region Code"] === d
      );
      return {
        code: d,
        name: intermediateRegion
          ? intermediateRegion["Intermediate Region Name"]
          : null,
      };
    });

  switch (level) {
    case UnLevel.Countries:
      return countryCodes;
    case UnLevel.Regions:
      return regions;
    case UnLevel.SubRegions:
      return subRegions;
    case UnLevel.IntermediateRegions:
      return intermediateRegions;
    default:
      return countryCodes;
  }
}
