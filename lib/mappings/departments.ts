export enum Department {
  EOS = "EOS", // "Department of Earth Observation Science",
  AES = "AES", // "Department of Applied Earth Sciences",
  GIP = "GIP", // "Department of Geo-Information Processing",
  NRS = "NRS", // "Department of Natural Resources",
  PGM = "PGM", // "Department of Urban and Regional Planning and Geo-information Management",
  WRS = "WRS", // "Department of Water Resources",
  SUP = "SUP", // "Non-scientific support departments",
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
  NA: "#aaaaaa",
};

export const departmentMap = new Map([
  ["RES", Department.ALL],
  ["ESA", Department.AES],
  ["BMS", Department.ALL], // TODO: check with Menno-Jan how to proceed with department mapping
  ["CTW", Department.ALL],
]);

export const mapToDepartment = (str: string) => {
  if (!str) return undefined;
  if (!!str.match(/NULL|EN|IR|MPS/)) return undefined;
  if (!!str.match(/ENG|ESA|EA/g)) return "AES";
  if (!!str.match(/EREG/g)) return "NRS";
  if (!!str.match(/Various/g)) return "ALL";
  if (!!str.match(/CRIB|FB|IT|BPS|MPS|Library/g)) return "SUP";
  return str;
};
