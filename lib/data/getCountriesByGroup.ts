import getCountries from "./getCountries";
import * as topojson from "topojson-client";
import getUnsdCountries from "./getUnsdCountries";
import { UnGrouping } from "../../types/UnsdCodes";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";

const getCountriesByGroup = async (group: UnGrouping) => {
  const neCountriesTopojson = await getCountries();
  const areaCodes = await getUnsdCountries();

  const countriesOfGroup = areaCodes
    .filter((area) => area[group])
    .map((area) => area["ISO-alpha3 Code"]);

  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.countries
  ) as NeCountriesGeoJson;

  const countryFeatures = neCountriesGeoJson.features.filter((feature) =>
    countriesOfGroup.includes(feature.properties?.iso3code)
  );

  const countryFeatureCollection: NeCountriesGeoJson = {
    type: "FeatureCollection",
    features: countryFeatures,
  };

  return countryFeatureCollection;
};

export default getCountriesByGroup;
