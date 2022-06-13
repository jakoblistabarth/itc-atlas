import getCountries from "./getCountries";
import type { FeatureCollection, Feature, MultiPolygon } from "geojson";
import * as topojson from "topojson-client";
import getUnsdCountries from "./getUnsdCountries";
import { UnGrouping } from "../../types/UnsdCodes";

const getCountriesByGroup = async (group: UnGrouping) => {
  const world = await getCountries();
  const areaCodes = await getUnsdCountries();

  const countriesOfGroup = areaCodes
    .filter((area) => area[group])
    .map((area) => area["ISO-alpha3 Code"]);

  const countries: FeatureCollection<MultiPolygon> = {
    type: "FeatureCollection",
    features: topojson
      .feature(world, world.objects.countries)
      .features.filter((feature: Feature<MultiPolygon>) =>
        countriesOfGroup.includes(feature.properties?.iso3code)
      ),
  };

  return countries;
};

export default getCountriesByGroup;
