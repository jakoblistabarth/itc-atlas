import DataFrame from "../DataFrame/DataFrame";
import loadUnsdCodes from "./load/loadUnsdCodes";
import { ProjectType, ProjectStatus, Project } from "../../types/Project";
import { mapCountries } from "../mappings/country.name.EN";
import { UnLevel } from "../../types/UnsdCodes";
import loadUnsdCountries from "./load/loadUnsdCountries";

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
        ? `[${row.projectID}-${row.projectName.substr(0, 3)}]`
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
    .renameColumn({ Result: "result" })
    .renameColumn({ "Next action": "nextAction" })
    .renameColumn({ Remarks: "remarks" })
    .renameColumn({ "Project summary": "projectSummary" })
    .renameColumn({ "Funding type": "fundingType" })
    .renameColumn({ "Tender type": "tenderType" })
    .renameColumn({ "Percentage covered by ITC": "percentageCoveredByITC" })
    .renameColumn({
      "Percentage covered by partner(s)": "percentageCoveredByPartners",
    })
    .renameColumn({ Division: "division" })
    .renameColumn({ "Project officer": "projectOfficer" })
    .renameColumn({ "Project supervisor": "projectSupervisor" })
    .renameColumn({ "Project administrator": "projectAdministrator" })
    .renameColumn({ "Number of ITC staff involved": "ITCStaffInvolved" })
    .renameColumn({ "Number of man months ITC": "manMonthsITC" })
    .renameColumn({ "Number of man months partner(s)": "manMonthsPartners" })
    .renameColumn({ "Personmonths abroad": "personMonthsAbroad" })
    .renameColumn({ "Personmonths in NL": "personMonthsNL" })
    .renameColumn({ "Student months abroad": "studentMonthsAbroad" })
    .renameColumn({ "Student months in NL": "studentMonthsNL" })
    .renameColumn({ "Total project budget": "totalBudget" })
    .renameColumn({ "Total ITC budget": "totalITCBudget" })
    .renameColumn({ "Sub contractor budget": "subContractorBudget" })
    .renameColumn({ "Consulting budget": "consultingBudget" })
    .where((row) => new Date(row.dateStart) < new Date(row.dateEnd)); // TODO: fix projects whith old entries

  const output = merged.toArray();

  output.forEach((d) => {
    if (typeof d.countriesRegion !== "string") return;
    d.countriesRegionArr = d.countriesRegion.split(/\s?[,/]\s?/gm);
    d.regions = [];
    d.subRegions = [];
    d.intermediateRegions = [];
    d.countries = [];
  });

  const countries = await loadUnsdCountries();
  const regionCodes = await loadUnsdCodes(UnLevel.Regions);
  const subRegionCodes = await loadUnsdCodes(UnLevel.SubRegions);
  const intermediateRegionCodes = await loadUnsdCodes(
    UnLevel.IntermediateRegions
  );

  // Matching
  // TODO: recognise group: EU
  output.forEach((d, row) => {
    if (!Array.isArray(d.countriesRegionArr)) return;
    return d.countriesRegionArr?.forEach((e) => {
      if (!e) return;

      const regions = output[row].regions;
      const regionMatch = regionCodes.find((f) => f.name === e);
      if (regionMatch && regionMatch.name && Array.isArray(regions)) {
        return regions.push(regionMatch.name);
      }

      const subRegions = output[row].subRegions;
      const subRegionMatch = subRegionCodes.find((f) => f.name === e);
      if (subRegionMatch && subRegionMatch.name && Array.isArray(subRegions)) {
        return subRegions.push(subRegionMatch.name);
      }

      const intermediateRegions = output[row].intermediateRegions;
      const intermediateRegionMatch = intermediateRegionCodes.find(
        (f) => f.name?.toUpperCase() === e.toUpperCase()
      );
      if (
        intermediateRegionMatch &&
        intermediateRegionMatch.name &&
        Array.isArray(intermediateRegions)
      ) {
        return intermediateRegions.push(intermediateRegionMatch.name);
      }

      const countryMatch = countries.find((f) =>
        f["Country or Area"].toUpperCase().match(e.toUpperCase())
      );
      const countriesList = output[row].countries;
      if (!countryMatch || !Array.isArray(countriesList)) return;
      const code = countryMatch["ISO-alpha3 Code"];
      if (!countriesList?.includes(code)) countriesList.push(code);
    });
  });

  output.forEach((d) => {
    if (!Array.isArray(d.countries)) return;
    const allCountries = Array.from(d.countries);

    if (Array.isArray(d.regions))
      d.regions.forEach((region) => {
        allCountries.push(
          ...countries
            .filter((e) => e["Region Name"] === region)
            .map((e) => e["ISO-alpha3 Code"])
        );
      });

    if (Array.isArray(d.subRegions))
      d.subRegions.forEach((subregion) => {
        allCountries.push(
          ...countries
            .filter((e) => e["Sub-region Name"] === subregion)
            .map((e) => e["ISO-alpha3 Code"])
        );
      });

    if (Array.isArray(d.intermediateRegions))
      d.intermediateRegions.forEach((intermediateRegion) => {
        allCountries.push(
          ...countries
            .filter((e) => e["Intermediate Region Name"] === intermediateRegion)
            .map((e) => e["ISO-alpha3 Code"])
        );
      });

    d.allCountries = Array.from(new Set(allCountries));
  });

  return output as Project[];
}
