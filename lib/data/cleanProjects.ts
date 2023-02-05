import loadUnsdCodes from "./load/loadUnsdCodes";
import { ProjectType, ProjectStatus, Project } from "../../types/Project";
import { mapCountries } from "../mappings/country.name.EN";
import { UnLevel } from "../../types/UnsdCodes";
import loadUnsdCountries from "./load/loadUnsdCountries";
import * as aq from "arquero";
import { ProjectPre2019Raw, ProjectPost2019Raw } from "./getProjects";

export type ProjectClean = {
  projectId: string;
  countriesRegion: string;
  countriesRegionArr: string[];
  regions: string[];
  subRegions: string[];
  intermediateRegions: string[];
  countries: string[];
  allCountries: string[];
};

type ProjectMerged = {
  type: ProjectType;
  status: ProjectStatus;
  countriesRegion: string;
  dateStart: string;
  dateEnd: string;
};

export default async function cleanProjects({
  projectsPre2019,
  projectsPost2019,
}: {
  projectsPre2019: ProjectPre2019Raw;
  projectsPost2019: ProjectPost2019Raw;
}) {
  const post2019 = aq.from(projectsPost2019).rename({
    projecttype: "type",
    Status: "status",
    CountriesRegion: "countriesregion",
  });
  const pre2019 = aq.from(projectsPre2019).rename({
    Project_ID: "projectID",
    "Project name": "projectName",
    "Project name in short": "projectShortName",
    "Project status": "status",
    "Project type": "type",
    Country: "countriesRegion",
    "Starting date": "dateStart",
    "Completion date": "dateEnd",
  });

  const merged = aq
    .from([...pre2019.objects(), ...post2019.objects()])
    .derive({
      projectShortName: aq.escape((row: any) =>
        row.projectShortName === ""
          ? `[${row.projectID}-${row.projectName.substr(0, 3)}]`
          : row.projectShortName
      ),
      dateStart: aq.escape((row: any) =>
        !row.dateStart || row.dateStart === "NULL"
          ? null
          : row.dateStart.toISOString()
      ),

      dateEnd: aq.escape((row: any) =>
        !row.dateEnd || row.dateEnd === "NULL"
          ? null
          : row.dateEnd.toISOString()
      ),
      type: aq.escape(
        (row: ProjectMerged) => ProjectType[row.type] || row.type
      ),
      status: aq.escape(
        (row: ProjectMerged) => ProjectStatus[row.status] || row.status
      ),
      countriesRegion: aq.escape((row: ProjectMerged) =>
        mapCountries(row.countriesRegion)
      ),
    })
    .rename({
      Result: "result",
      "Next action": "nextAction",
      Remarks: "remarks",
      "Project summary": "projectSummary",
      "Funding type": "fundingType",
      "Tender type": "tenderType",
      "Percentage covered by ITC": "percentageCoveredByITC",
      "Percentage covered by partner(s)": "percentageCoveredByPartners",
      Division: "division",
      "Project officer": "projectOfficer",
      "Project supervisor": "projectSupervisor",
      "Project administrator": "projectAdministrator",
      "Number of ITC staff involved": "ITCStaffInvolved",
      "Number of man months ITC": "manMonthsITC",
      "Number of man months partner(s)": "manMonthsPartners",
      "Personmonths abroad": "personMonthsAbroad",
      "Personmonths in NL": "personMonthsNL",
      "Student months abroad": "studentMonthsAbroad",
      "Student months in NL": "studentMonthsNL",
      "Total project budget": "totalBudget",
      "Total ITC budget": "totalITCBudget",
      "Sub contractor budget": "subContractorBudget",
      "Consulting budget": "consultingBudget",
    })
    .filter(
      aq.escape(
        (row: ProjectMerged) => new Date(row.dateStart) < new Date(row.dateEnd)
      )
    ); // TODO: fix projects whith old entries

  const output = merged.objects() as ProjectClean[];

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

  return output;
}
