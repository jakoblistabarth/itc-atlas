export enum Department {
  EOS = "EOS", // "Department of Earth Observation Science",
  AES = "AES", // "Department of Applied Earth Sciences",
  GIP = "GIP", // "Department of Geo-Information Processing",
  NRS = "NRS", // "Department of Natural Resources",
  PGM = "PGM", // "Department of Urban and Regional Planning and Geo-information Management",
  WRS = "WRS", // "Department of Water Resources",
  SUP = "SUP", // "Non-scientific support departments",
  VAR = "Other", // "ITC", //TODO: map to existing department?
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

// TODO: Should we differentiate VAR further into internal (within ITC/UT) and external

export const mapToDepartment = (str?: string): Department[] | undefined => {
  if (!str || str.match(/^(NULL|EN|IR|MPS|BOOZ|RC|IIH|TA|AA)$/))
    return undefined;
  if (str.match(/^GFM$/)) return [Department.EOS, Department.GIP];
  if (str.match(/^(EOS)$/)) return [Department.EOS];
  if (str.match(/^(AES|ARS|ENG|ESA|EREG|NHR)$/)) return [Department.AES];
  if (str.match(/^(GIP|CART|GIM|GIMA)$/)) return [Department.GIP];
  if (str.match(/^(NRS|NRM|GEM|IGEON)$/)) return [Department.NRS];
  if (str.match(/^(PGM|(GIM|UP)?LA|GSIM|UPM)$/)) return [Department.PGM];
  if (str.match(/^(WRS|WREM)$/)) return [Department.WRS];
  if (str.match(/^(CRIB|FB|IT|BPS|MPS|CTW|BMS|PERS|S&A|FM|COM|Library)$/))
    return [Department.SUP];
  return [Department.VAR];
};
