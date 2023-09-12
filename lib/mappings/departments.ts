export enum Department {
  EOS = "EOS", // "Department of Earth Observation Science",
  AES = "AES", // "Department of Applied Earth Sciences",
  GIP = "GIP", // "Department of Geo-Information Processing",
  NRS = "NRS", // "Department of Natural Resources",
  PGM = "PGM", // "Department of Urban and Regional Planning and Geo-information Management",
  WRS = "WRS", // "Department of Water Resources",
  SUP = "SUP", // "Non-scientific support departments",
  VAR = "VAR", // "ITC", //TODO: map to existing department?
}

export const departmentColors = {
  [Department.EOS]: "#ff1f5b",
  [Department.AES]: "#00cd6c",
  [Department.GIP]: "#009ade",
  [Department.NRS]: "#af58ba",
  [Department.PGM]: "#ffc61e",
  [Department.WRS]: "#f28522",
  [Department.VAR]: "#000000",
  NA: "#ffffff",
};

// TODO: check with Menno-Jan how to proceed with department mapping
// CTW, BMS, PERS, S&A, FM, COM -> SUP
// RES -> VAR
// RC ?
// BOOZ ?
// IIH ?
// TA ?
// AA

export const mapToDepartment = (str?: string) => {
  if (!str) return undefined;
  if (!!str.match(/RC|BOOZ|IIH|TA|AA/)) return undefined;
  if (!!str.match(/NULL|EN|IR|MPS/)) return undefined;
  if (!!str.match(/ENG|ESA|EA/)) return "AES";
  if (!!str.match(/EREG/)) return "NRS";
  if (!!str.match(/ITC|Various|RES/)) return "VAR";
  if (!!str.match(/CRIB|FB|IT|BPS|MPS|CTW|BMS|PERS|S&A|FM|COM|Library/))
    return "SUP";
  return str;
};
