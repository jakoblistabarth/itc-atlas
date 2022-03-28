import * as df from "data-forge";
import getUnsdCodes from "./getUnsdCodes";

export default async function cleanProjects(input: Object[]) {
  const post2019 = new df.DataFrame(input[0]);
  const pre2019 = new df.DataFrame(input[1]);
  const post2019T = post2019.dropSeries(["dateVOCA"]);

  const pre2019T = pre2019.renameSeries({
    Project_ID: "projectID",
    "Project name": "projectName",
    "Project name in short": "projectShortName",
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
    })
    .where((row) => new Date(row["dateStart"]) < new Date(row["dateEnd"]));
  const output = merged.toArray();

  const areaCodes = await getUnsdCodes();

  console.log(areaCodes.countries[0]);

  output.forEach((d) => {
    d.CountriesRegionArr = d.CountriesRegion.split(/\s?[,/]\s?/gm);
    d.regions = [];
    d.subRegions = [];
    d.intermediateRegions = [];
    d.countries = [];
  });

  // Matching
  // TODO: recognise USA, Kazakstan, Bangladesch, Cabo Verde
  // TODO: recognise groups: EU, EMEA, BENELUX
  output.forEach((d, row) =>
    d.CountriesRegionArr.forEach((e, index) => {
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

  return output;
}
