import * as aq from "arquero";
import loadUnsdCountries from "./loadUnsdCountries";

export type UnRegion = { code: string; level: string; name: string };

export default async function loadUnsdRegions() {
  const countries = await loadUnsdCountries();

  const regions = aq
    .from(countries)
    .select(["Region Code", "Region Name"])
    .derive({ level: () => "Region" })
    .rename({ "Region Code": "code", "Region Name": "name" });
  const subRegions = aq
    .from(countries)
    .select(["Sub-region Code", "Sub-region Name"])
    .derive({ level: () => "Sub-Region" })
    .rename({ "Sub-region Code": "code", "Sub-region Name": "name" });
  const intermediateRegions = aq
    .from(countries)
    .select(["Intermediate Region Code", "Intermediate Region Name"])
    .derive({ level: () => "Intermediate Region" })
    .rename({
      "Intermediate Region Code": "code",
      "Intermediate Region Name": "name",
    });
  const res = regions
    .concat(subRegions, intermediateRegions)
    .dedupe("code")
    .filter((d: UnRegion) => d.code);
  return res.objects() as UnRegion[];
}
