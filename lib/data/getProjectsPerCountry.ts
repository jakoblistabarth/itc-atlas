import * as d3 from "d3";
import getProjects from "./getProjects";
import type { FeatureCollection, Feature, MultiPolygon, Point } from "geojson";
import * as topojson from "topojson-client";
import type { Project } from "../../types/Project";
import getCountries from "./getCountries";

const getProjectsPerCountry = async () => {
  const neCountriesTopojson = getCountries();
  const [allProjects] = await Promise.all([getProjects()]);

  const projects = allProjects.filter(
    (
      row
    ): row is Omit<Project, "dateStart" | "dateEnd" | "projectID"> & {
      dateStart: string;
      dateEnd: string;
      projectID: string;
    } => typeof row.dateStart === "string" && typeof row.dateEnd === "string"
  );

  projects.sort((a, b) =>
    d3.ascending(new Date(a.dateStart), new Date(b.dateStart))
  );

  const count = d3
    .rollups(
      projects.reduce((acc: string[], proj) => {
        acc.push(...proj.countries); // or proj.allCountries
        return acc;
      }, []),
      (v) => v.length,
      (d) => d
    )
    .sort((a, b) => d3.descending(a[1], b[1]));

  const projectsCountry = new Map(count);

  const projectCount = Array.from(projectsCountry.values());
  const minDomain = d3.min(projectCount) ?? 0; // TODO: meaningful fallback values
  const maxDomain = d3.max(projectCount) ?? 10;
  const domain: [number, number] = [minDomain, maxDomain];

  const neCountriesGeoJson = topojson.feature(
    neCountriesTopojson,
    neCountriesTopojson.objects.ne_admin_0_countries
  );

  const data: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: neCountriesGeoJson.features
      .map((feature) => {
        const value = projectsCountry.get(feature.properties?.ADM0_A3_NL);
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
