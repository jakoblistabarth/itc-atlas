import { FC } from "react";
import getCountryName from "../../lib/getCountryName";
import { Card } from "../Card";
import { InternMap, scaleOrdinal, schemeBlues } from "d3";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import LineChart, { LineChartData } from "../LineChart";
import { HiXMark } from "react-icons/hi2";
import { ProjectsWithCountries } from "../../lib/data/queries/project/getProjectsWithCountries";
import { LinePathDatum } from "../LinePath/LinePathBase";

type Props = {
  selectedCountries: string[];
  projectsByYearCountry: {
    year: string;
    countries: InternMap<string, number>;
  }[];
  neCountriesTopoJson: NeCountriesTopoJson;
  projects: ProjectsWithCountries;
  setSelectedCountries: (ids: string[]) => void;
};

const SelectedProjectDetails: FC<Props> = ({
  selectedCountries,
  projectsByYearCountry,
  neCountriesTopoJson,
  projects,
  setSelectedCountries,
}) => {
  const linePathData: LineChartData = selectedCountries.map((isoCode) => {
    return projectsByYearCountry
      .filter((year) => year.countries.has(isoCode))
      .reduce(
        (
          acc: { id: string; label: string; data: LinePathDatum[] },
          { year, countries },
        ) => ({
          ...acc,
          data: [
            ...acc.data,
            {
              x: parseInt(year),
              y: countries.get(isoCode) ?? 0,
            },
          ].sort((a, b) => a.x - b.x),
        }),
        { id: isoCode, label: "countryname", data: [] },
      );
  });

  return (
    <div className="w-[400px]">
      <Card>
        <Card.Header>
          <p className="text-xs italic">Details</p>
        </Card.Header>
        <Card.Body>
          {selectedCountries.length > 0 ? (
            <>
              <h2>Selected Countries</h2>
              <div className="flex flex-wrap gap-1 text-xs">
                {selectedCountries.map((isoCode) => (
                  <div
                    key={isoCode}
                    className="rounded-full bg-itc-green-100 px-2 py-1"
                  >
                    {getCountryName(isoCode, neCountriesTopoJson)}
                    <span className="ml-1">
                      (
                      {
                        projects.filter((d) =>
                          d.countries.map((d) => d.isoAlpha3).includes(isoCode),
                        ).length
                      }
                      )
                    </span>
                  </div>
                ))}
                <div
                  className="cursor-pointer rounded-full bg-itc-green px-2 py-1 text-white hover:bg-itc-green-800"
                  onClick={() => setSelectedCountries([])}
                >
                  <HiXMark className="mr-2 inline" />
                  Clear country selection
                </div>
              </div>
            </>
          ) : (
            <p>Select a country to see details.</p>
          )}
          {linePathData.length > 0 && (
            <div className="mt-10 h-[200px]">
              <LineChart
                data={linePathData}
                yLabel={"projects"}
                colorScale={scaleOrdinal<string, string>().range(
                  schemeBlues[5],
                )}
                mouseEnterLeaveHandler={() => undefined}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SelectedProjectDetails;
