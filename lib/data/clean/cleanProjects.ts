import loadUnsdCodes from "../load/loadUnsdCodes";
import { mapCountries } from "../../mappings/country.name.EN";
import { UnLevel } from "../../../types/UnsdCodes";
import loadUnsdCountries from "../load/loadUnsdCountries";
import * as aq from "arquero";
import { ProjectPre2019Raw, ProjectPost2019Raw } from "../load/loadProjects";
import { mapToDepartment } from "../../mappings/departments";
import { mapToOrganizationGroup } from "../../mappings/organizationGroup";
import mapToProjectStatus from "../../mappings/project.status";

export type ProjectClean = Omit<ProjectMerged, "id"> & {
  id: number;
  countriesRegionArr: string[];
  regions: string[];
  subRegions: string[];
  intermediateRegions: string[];
  countries: string[];
  allCountries: string[];
};

type ProjectMerged = {
  id: string;
  name: string;
  nameShort: string;
  type: string;
  tenderType: string;
  status: string;
  description: string;
  fundingType: string;
  fundingOrganization: string;
  leadOrganization: string;
  leadDepartment: string;
  otherDepartments?: string[];
  countriesRegion: string;
  dateStart: string;
  dateEnd: string;
  totalBudget: number;
  totalITCBudget: number;
};

const cleanProjects = async ({
  projectsPre2019,
  projectsPost2019,
}: {
  projectsPre2019: ProjectPre2019Raw[];
  projectsPost2019: ProjectPost2019Raw[];
}) => {
  const pre2019 = aq
    .from(projectsPre2019)
    .derive({
      leadDepartment: (d: ProjectPre2019Raw) =>
        aq.op.split(d["Division"], /,\s?|\s?\/\s?/, 10)[0],
      otherDepartments: aq.escape((d: ProjectPre2019Raw) => {
        const list = aq.op.split(d["Division"], /,\s?|\s?\/\s?/, 10);
        return aq.op.slice(list, 1, list.length);
      }),
    })
    .rename({
      Project_ID: "id",
      "Project name": "name",
      "Project name in short": "nameShort",
      "Project summary": "description",
      "Project status": "status",
      "Project type": "type",
      Country: "countriesRegion",
      "Starting date": "dateStart",
      "Completion date": "dateEnd",
      "Consulting budget": "consultingBudget",
      "Funding type": "fundingType",
      "Next action": "nextAction",
      "Number of ITC staff involved": "ITCStaffInvolved",
      "Number of man months ITC": "manMonthsITC",
      "Number of man months partner(s)": "manMonthsPartners",
      "Percentage covered by ITC": "percentageCoveredByITC",
      "Percentage covered by partner(s)": "percentageCoveredByPartners",
      "Personmonths abroad": "personMonthsAbroad",
      "Personmonths in NL": "personMonthsNL",
      "Project administrator": "projectAdministrator",
      "Project officer": "projectOfficer",
      "Project supervisor": "projectSupervisor",
      "Student months abroad": "studentMonthsAbroad",
      "Student months in NL": "studentMonthsNL",
      "Sub contractor budget": "subContractorBudget",
      "Tender type": "tenderType",
      "Total ITC budget": "totalITCBudget",
      "Total project budget": "totalBudget",
      Remarks: "remarks",
      Result: "result",
    });

  const post2019 = aq
    .from(projectsPost2019)
    .derive({
      fundingOrganization: aq.escape((d: ProjectPost2019Raw) =>
        mapToOrganizationGroup(d.Client_FundingAgency)
      ),
      leadOrganization: aq.escape((d: ProjectPost2019Raw) =>
        mapToOrganizationGroup(d.LeadOrganisation)
      ),
    })
    .rename({
      projectName: "name",
      projectShortName: "projectShortName",
      CountriesRegion: "countriesregion",
      descriptionProject: "description",
      LeadDepartment: "leadDepartment",
      projectID: "id",
      projecttype: "type",
      Status: "status",
    })
    .derive({
      otherDepartments: (d: ProjectPost2019Raw) =>
        aq.op.split(d.OtherDepartments, /,\s?/, 10),
    });

  const merged = pre2019
    .antijoin(post2019, "id")
    .join_full(post2019)
    .derive({
      id: (d: ProjectMerged) => aq.op.parse_int(d.id, 10),
      nameShort: aq.escape((row: ProjectMerged) =>
        row.nameShort === ""
          ? `[${row.id}-${row.name.substring(0, 3)}]`
          : row.nameShort
      ),
      dateStart: aq.escape((row: ProjectMerged) =>
        !row.dateStart || row.dateStart === "NULL" ? null : row.dateStart
      ),
      dateEnd: aq.escape((row: ProjectMerged) =>
        !row.dateEnd || row.dateEnd === "NULL" ? null : row.dateEnd
      ),
      status: aq.escape((row: ProjectMerged) => {
        return mapToProjectStatus(row.status);
      }),
      type: aq.escape((row: ProjectMerged) => {
        if (!row.type) return undefined;
        if (!!row.type.match(/Education/g)) return "Education";
        if (!!row.type.match(/Resear?ch/g)) return "Research";
        if (!!row.type.match(/Consulting/g)) return "Consulting";
        return "Other";
      }),
      leadDepartment: aq.escape((row: ProjectMerged) =>
        mapToDepartment(row.leadDepartment)
      ),
      countriesRegion: aq.escape((row: ProjectMerged) =>
        mapCountries(row.countriesRegion)
      ),
    })
    .derive({
      otherDepartments: aq.escape((row: ProjectMerged) =>
        Array.isArray(row.otherDepartments) && row.otherDepartments[0]
          ? row.otherDepartments
              .map((d) => mapToDepartment(d))
              .filter((d) => d != row.leadDepartment)
          : undefined
      ),
    })
    .filter(
      aq.escape(
        (row: ProjectMerged) =>
          row.dateEnd === null ||
          new Date(row.dateStart) < new Date(row.dateEnd)
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
};
export default cleanProjects;
