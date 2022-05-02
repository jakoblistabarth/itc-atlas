import { Topology } from "topojson-specification";
import getUnsdCountries from "./getUnsdCountries";

export default async function getCountries(
  scale: "10m" | "50m" | "110m" = "110m"
) {
  const url = `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-${scale}.json`;
  const world: Topology = await fetch(url).then((res) => res.json()); // QUESTION: okay?
  const unsdCodes = await getUnsdCountries();

  // TODO: fails for "W. Sahara", "Dem. Rep. Congo", "Fr. S. Antarctic Lands", "Côte d'Ivoire", "Eq. Guinea", "eSwatini", "Laos", "Vietnam", "North Korea", "South Korea", "Taiwan", "N. Cyprus", "Somaliland", "Kosovo", "S. Sudan"
  world.objects.countries.geometries.forEach((d) => {
    const matchedCountry = unsdCodes.find((code) =>
      code["Country or Area"].match(d.properties.name)
    );
    if (!matchedCountry) return;
    d.properties.iso3code = matchedCountry["ISO-alpha3 Code"];
  });

  return world;
}
