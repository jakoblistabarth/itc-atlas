export enum UnGrouping {
  LDC = "Least Developed Countries (LDC)",
  LLDC = "Land Locked Developing Countries (LLDC)",
  SIDS = "Small Island Developing States (SIDS)",
}

export enum UnLevel {
  Countries = "countries",
  Regions = "regions",
  SubRegions = "subRegions",
  IntermediateRegions = "intermediateRegions",
}

export type AreaCode = {
  "Global Code": string;
  "Global Name": string;
  "Region Code": string;
  "Region Name": string;
  "Sub-region Code": string;
  "Sub-region Name": string;
  "Intermediate Region Code": string;
  "Intermediate Region Name": string;
  "Country or Area": string;
  "M49 Code": string;
  "ISO-alpha2 Code": string;
  "ISO-alpha3 Code": string;
  "Least Developed Countries (LDC)": string;
  "Land Locked Developing Countries (LLDC)": string;
  "Small Island Developing States (SIDS)": string;
};
