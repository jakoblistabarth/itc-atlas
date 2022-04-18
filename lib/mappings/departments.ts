export enum Department {
  EOS = "Department of Earth Observation Science",
  AES = "Department of Applied Earth Sciences",
  GIP = "Department of Geo-Information Processing",
  NRS = "Department of Natural Resources",
  PGM = "Department of Urban and Regional Planning and Geo-information Management",
  WRS = "Department of Water Resources",
  RES = "??", //TODO: map to existing department?
}

export const departmentColors = {
  [Department.EOS]: "yellow",
  [Department.AES]: "orange",
  [Department.GIP]: "red",
  [Department.NRS]: "purple",
  [Department.PGM]: "pink",
  [Department.WRS]: "blue",
  [Department.RES]: "green",
  null: "grey",
};
