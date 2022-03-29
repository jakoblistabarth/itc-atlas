import * as df from "data-forge";
import getUnsdCodes from "./getUnsdCodes";
import projectType from "./mappings/project.type";
import projectStatus from "./mappings/project.status";

export default async function cleanProjects(input: Object[]) {
  const post2019 = new df.DataFrame(input[0]);
  const pre2019 = new df.DataFrame(input[1]);
  const post2019T = post2019.renameSeries({
    projecttype: "type",
    Status: "status",
  });

  const pre2019T = pre2019.renameSeries({
    Project_ID: "projectID",
    "Project name": "projectName",
    "Project name in short": "projectShortName",
    "Project status": "status",
    "Project type": "type",
    Country: "CountriesRegion",
    "Starting date": "dateStart",
    "Completion date": "dateEnd",
  });

  const merged = pre2019T
    .merge(post2019T)
    .transformSeries({
      projectShortName: (value, index) =>
        value === "" ? "project " + index : value,
      dateStart: (value) => (value === "NULL" ? null : value),
      dateEnd: (value) => (value === "NULL" ? null : value),
      type: (value) => projectType[value] || value,
      status: (value) => projectStatus[value] || value,
    })
    .where((row) => new Date(row["dateStart"]) < new Date(row["dateEnd"])); // TODO: fix projects whith old entries
  const output = merged.toArray();

  output.forEach((d) => {
    d.CountriesRegion = d.CountriesRegion.replace(/[\(\)]/g, ",");
    d.CountriesRegion = d.CountriesRegion.replace("Bangladesch", "Bangladesh");
    d.CountriesRegion = d.CountriesRegion.replace("Vietnam", "Viet Nam");
    d.CountriesRegion = d.CountriesRegion.replace("Kazakstan", "Kazakhstan");
    d.CountriesRegion = d.CountriesRegion.replace(
      "Palestinian Territories",
      "State of Palestine"
    );
    d.CountriesRegion = d.CountriesRegion.replace(
      /(Overijssel)|(Twente)/g,
      "Netherlands"
    );
    d.CountriesRegion = d.CountriesRegion.replace(
      "EMEA",
      "Europe, Africa, Western Asia"
    );
    d.CountriesRegion = d.CountriesRegion.replace("Cape Verde", "Cabo Verde");
    d.CountriesRegion = d.CountriesRegion.replace(
      "Benelux",
      "Belgium, Netherlands, Luxembourg"
    );
    d.CountriesRegion = d.CountriesRegion.replace(
      "The Netherlands",
      "Netherlands"
    );
    d.CountriesRegion = d.CountriesRegion.replace(
      "USA",
      "United States of America"
    );
  });

  output.forEach((d) => {
    d.CountriesRegionArr = d.CountriesRegion.split(/\s?[,/]\s?/gm);
    d.regions = [];
    d.subRegions = [];
    d.intermediateRegions = [];
    d.countries = [];
  });

  const areaCodes = await getUnsdCodes();

  // Matching
  // TODO: recognise group: EU
  output.forEach((d, row) =>
    d.CountriesRegionArr.forEach((e) => {
      if (!e) return;

      const regionMatch = areaCodes.regions.find((f) => f.name === e);
      if (regionMatch) {
        // output[row].CountriesRegionArr.splice(index, 1);
        return output[row].regions.push(regionMatch.name);
      }

      const subRegionMatch = areaCodes.subRegions.find((f) => f.name === e);
      if (subRegionMatch) {
        // output[row].CountriesRegionArr.splice(index, 1);
        return output[row].subRegions.push(subRegionMatch.name);
      }

      const intermediateRegionMatch = areaCodes.intermediateRegions.find(
        (f) => f.name.toUpperCase() === e.toUpperCase()
      );
      if (intermediateRegionMatch) {
        // output[row].CountriesRegionArr.splice(index, 1);
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
