export enum Department {
  EOS = "EOS", // "Department of Earth Observation Science",
  AES = "AES", // "Department of Applied Earth Sciences",
  GIP = "GIP", // "Department of Geo-Information Processing",
  NRS = "NRS", // "Department of Natural Resources",
  PGM = "PGM", // "Department of Urban and Regional Planning and Geo-information Management",
  WRS = "WRS", // "Department of Water Resources",
  ALL = "ALL", // "ITC", //TODO: map to existing department?
}

export const departmentColors = {
  [Department.EOS]: "#ff1f5b",
  [Department.AES]: "#00cd6c",
  [Department.GIP]: "#009ade",
  [Department.NRS]: "#af58ba",
  [Department.PGM]: "#ffc61e",
  [Department.WRS]: "#f28522",
  [Department.ALL]: "#000000",
  null: "#aaaaaa",
};

export const departmentMap = {
  RES: Department.ALL,
  ESA: Department.AES,
};
