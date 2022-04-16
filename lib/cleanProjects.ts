import DataFrame from "./DataFrame";
import getUnsdCodes from "./getUnsdCodes";
import { ProjectType, ProjectStatus } from "../types/Project";
import { mapCountries } from "./mappings/country.name";

export default async function cleanProjects(input: any[]) {
  const post2019 = new DataFrame(input[0])
    .renameColumn({ projecttype: "type" })
    .renameColumn({ Status: "status" })
    .renameColumn({ CountriesRegion: "countriesRegion" });
  const pre2019 = new DataFrame(input[1])
    .renameColumn({ Project_ID: "projectID" })
    .renameColumn({ "Project name": "projectName" })
    .renameColumn({ "Project name in short": "projectShortName" })
    .renameColumn({ "Project status": "status" })
    .renameColumn({ "Project type": "type" })
    .renameColumn({ Country: "countriesRegion" })
    .renameColumn({ "Starting date": "dateStart" })
    .renameColumn({ "Completion date": "dateEnd" });

  const merged = pre2019
    .merge(post2019)
    .mutate("projectShortName", (row) =>
      row.projectShortName === ""
        ? row.projectName.substr(0, 2)
        : row.projectShortName
    )
    .mutate("dateStart", (row) =>
      !row.dateStart || row.dateStart === "NULL"
        ? null
        : row.dateStart.toISOString()
    )
    .mutate("dateEnd", (row) =>
      !row.dateEnd || row.dateEnd === "NULL" ? null : row.dateEnd.toISOString()
    )
    .mutate("type", (row) => ProjectType[row.type] || row.type)
    .mutate("status", (row) => ProjectStatus[row.status] || row.status)
    .mutate("countriesRegion", (row) => mapCountries(row.countriesRegion))
    .where((row) => new Date(row.dateStart) < new Date(row.dateEnd)); // TODO: fix projects whith old entries

  const output = merged.toArray();

  console.log(output.filter((row) => !row.countriesRegion).length);

  output.forEach((d) => {
    d.countriesRegionArr = d.countriesRegion.split(/\s?[,/]\s?/gm);
    d.regions = [];
    d.subRegions = [];
    d.intermediateRegions = [];
    d.countries = [];
  });

  const areaCodes = await getUnsdCodes();

  // Matching
  // TODO: recognise group: EU
  output.forEach((d, row) =>
    d.countriesRegionArr.forEach((e) => {
      if (!e) return;

      const regionMatch = areaCodes.regions.find((f) => f.name === e);
      if (regionMatch) {
        return output[row].regions.push(regionMatch.name);
      }

      const subRegionMatch = areaCodes.subRegions.find((f) => f.name === e);
      if (subRegionMatch) {
        return output[row].subRegions.push(subRegionMatch.name);
      }

      const intermediateRegionMatch = areaCodes.intermediateRegions.find(
        (f) => f.name.toUpperCase() === e.toUpperCase()
      );
      if (intermediateRegionMatch) {
        return output[row].intermediateRegions.push(
          intermediateRegionMatch.name
        );
      }

      const countryMatch = areaCodes.countries.find((f) =>
        f["Country or Area"].toUpperCase().match(e.toUpperCase())
      );
      if (!countryMatch) return;
      const countriesList = output[row].countries;
      const code = countryMatch["ISO-alpha3 Code"];
      if (!countriesList.includes(code)) output[row].countries.push(code);
    })
  );

  output.forEach((d, row) => {
    const allCountries = Array.from(d.countries);

    d.regions.forEach((region) => {
      allCountries.push(
        ...areaCodes.countries
          .filter((e) => e["Region Name"] === region)
          .map((e) => e["ISO-alpha3 Code"])
      );
    });

    d.subRegions.forEach((subregion) => {
      allCountries.push(
        ...areaCodes.countries
          .filter((e) => e["Sub-region Name"] === subregion)
          .map((e) => e["ISO-alpha3 Code"])
      );
    });

    d.intermediateRegions.forEach((intermediateRegion) => {
      allCountries.push(
        ...areaCodes.countries
          .filter((e) => e["Intermediate Region Name"] === intermediateRegion)
          .map((e) => e["ISO-alpha3 Code"])
      );
    });

    d.allCountries = Array.from(new Set(allCountries));
  });

  return output;
}
