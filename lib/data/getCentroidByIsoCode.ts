import getCountries from "./getCountries";
import { feature } from "topojson-client";
import { geoCentroid } from "d3-geo";
import { Vector2 } from "three";

const getCentroidByIsoCode = (isoCode: string) => {
  const countries = getCountries();
  const fc = feature(countries, countries.objects.ne_admin_0_countries);
  const match = fc.features.find((f) => f.properties.ADM0_A3_NL === isoCode);
  if (!match) return;
  return new Vector2(...geoCentroid(match)); //TODO: don't use vector2?
};

export default getCentroidByIsoCode;
