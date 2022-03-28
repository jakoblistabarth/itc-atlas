import * as csv from "csvtojson";

export default async function getUnsdCodes(level?: String) {
  const csvFilePath = "./data/UNSD-Methodology.csv";
  // source: https://unstats.un.org/unsd/methodology/m49/overview/
  const countries = await csv().fromFile(csvFilePath);

  const regions = Array.from(new Set(countries.map((d) => d["Region Code"])))
    .filter((d) => d)
    .map((d) => {
      const name = countries.find((e) => e["Region Code"] === d)["Region Name"];
      return {
        code: d,
        name: name,
      };
    });

  const subRegions = Array.from(
    new Set(countries.map((d) => d["Sub-region Code"]))
  )
    .filter((d) => d)
    .map((d) => {
      const name = countries.find((e) => e["Sub-region Code"] === d)[
        "Sub-region Name"
      ];
      return {
        code: d,
        name: name,
      };
    });

  const intermediateRegions = Array.from(
    new Set(countries.map((d) => d["Intermediate Region Code"]))
  )
    .filter((d) => d)
    .map((d) => {
      const name = countries.find((e) => e["Intermediate Region Code"] === d)[
        "Intermediate Region Name"
      ];
      return {
        code: d,
        name: name,
      };
    });

  switch (level) {
    case "countries":
      return countries;
    case "regions":
      return regions;
    case "subRegions":
      return subRegions;
    case "intermediateRegions":
      return intermediateRegions;
    default:
      return {
        countries,
        regions,
        subRegions,
        intermediateRegions,
      };
  }
}
