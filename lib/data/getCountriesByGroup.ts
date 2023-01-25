import getCountries from "./getCountries";
import * as topojson from "topojson-client";
import loadUnsdCountries from "./load/loadUnsdCountries";
import { UnGrouping } from "../../types/UnsdCodes";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { CountryProperties } from "../../types/NeTopoJson";
import type { Feature, Polygon, MultiPolygon } from "geojson";

const getCountriesByGroup = async (group: UnGrouping) => {
  const neCountriesTopojson = getCountries();
  const areaCodes = await loadUnsdCountries();

  const countriesOfGroup = areaCodes
    .filter((area) => area[group])
    .map((area) => area["ISO-alpha3 Code"]);

  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.ne_admin_0_countries
  );

  const countryFeatures = neCountriesGeoJson.features.filter((feature) =>
    countriesOfGroup.includes(feature.properties?.ADM0_A3_NL)
  );

  const countryFeatureCollection: NeCountriesGeoJson = {
    type: "FeatureCollection",
    features: countryFeatures as Feature<
      Polygon | MultiPolygon,
      CountryProperties
    >[], //todo ensure geometry type
  };

  return countryFeatureCollection;
};

export default getCountriesByGroup;
