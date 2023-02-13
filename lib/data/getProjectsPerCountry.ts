import * as d3 from "d3";
import type { FeatureCollection, Feature, Point } from "geojson";
import * as topojson from "topojson-client";
import getCountries from "./getCountries";
import getCountryWithProjectCount from "./queries/country/getCountryWithProjectCount";

const getProjectsPerCountry = async () => {
  const neCountriesTopojson = getCountries();
  const count = await getCountryWithProjectCount();

  const minDomain = d3.min(count.map((d) => d._count.projects)) ?? 0; // TODO: meaningful fallback values
  const maxDomain = d3.max(count.map((d) => d._count.projects)) ?? 10;
  const domain: [number, number] = [minDomain, maxDomain];

  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.ne_admin_0_countries
  );

  const data: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: neCountriesGeoJson.features
      .map((feature) => {
        const value = count.find(
          (d) => d.isoAlpha3 === feature.properties?.ADM0_A3_NL
        )?._count.projects;
        const pointFeature: Feature<Point> = {
          type: "Feature",
          properties: {
            projectCount: value,
            ...feature.properties,
          },
          geometry: {
            type: "Point",
            coordinates: [
              d3.geoCentroid(feature)[0],
              d3.geoCentroid(feature)[1],
            ],
          },
        };
        return pointFeature;
      })
      .filter((feature: Feature) => feature.properties?.projectCount),
  };

  return { data, domain };
};

export default getProjectsPerCountry;
