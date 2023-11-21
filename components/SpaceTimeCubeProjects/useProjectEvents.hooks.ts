import { useMemo } from "react";
import { ProjectsWithCountries } from "../../lib/data/queries/project/getProjectsWithCountries";
import { hasDate } from "../../lib/helpers/hasDate";
import { group, rollup } from "d3";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";

const useProjectEvents = (projects: ProjectsWithCountries) => {
  return useMemo(() => {
    const projectsSplit = projects
      .filter((d) => hasDate(d))
      .map((p) => {
        const countries = p.countries.map((d) => d.isoAlpha3);
        return countries.flatMap((c) => [
          {
            ...p,
            country: c,
          },
        ]);
      })
      .flat();

    const projectsByYear = group(projectsSplit, (d) =>
      //@ts-expect-error needs to be fixed with mapped typing? (too complex for simple predicate)
      new Date(d.start).getFullYear().toString(),
    );
    const projectsByYearCountry = Array.from(projectsByYear.entries()).map(
      ([key, projectsPerYear]) => {
        const countries = rollup(
          projectsPerYear,
          (v) => v.length,
          (d) => d.country,
        );
        return { year: key, countries };
      },
    );

    const events: SpaceTimeCubeEvent[] = projectsByYearCountry.flatMap(
      ({ year, countries }) => {
        const countryList = Array.from(countries.entries());
        return countryList.flatMap(([name, size]) => {
          const coordinates = getCentroidByIsoCode(name);
          return coordinates
            ? [
                {
                  name,
                  dateStart: new Date(year.toString()),
                  coordinates,
                  size,
                },
              ]
            : [];
        });
      },
    );
    return { events, projectsByYearCountry };
  }, [projects]);
};

export default useProjectEvents;
