import { FC } from "react";
import { Card } from "../Card";
import { InternMap, scaleOrdinal, schemeBlues } from "d3";
import LineChart, { LineChartData } from "../LineChart";
import { HiXMark } from "react-icons/hi2";
import { ProjectsWithCountries } from "../../lib/data/queries/project/getProjectsWithCountries";
import { LinePathDatum } from "../LinePath/LinePathBase";

type Props = {
  selectedCountries: { id: string; label: string }[];
  projectsByYearCountry: {
    year: string;
    countries: InternMap<string, number>;
  }[];
  projects: ProjectsWithCountries;
  setSelectedCountries: (features: { id: string; label: string }[]) => void;
};

const SelectedProjectDetails: FC<Props> = ({
  selectedCountries,
  projectsByYearCountry,
  projects,
  setSelectedCountries,
}) => {
  const linePathData: LineChartData = selectedCountries.map(({ id, label }) => {
    return projectsByYearCountry
      .filter((year) => year.countries.has(id))
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
              y: countries.get(id) ?? 0,
            },
          ].sort((a, b) => a.x - b.x),
        }),
        { id, label, data: [] },
      );
  });

  return (
    <div className="pointer-events-auto w-[400px]">
      <Card>
        <Card.Header>
          <p className="text-xs italic">Details</p>
        </Card.Header>
        <Card.Body>
          {selectedCountries.length > 0 ? (
            <>
              <h2>Selected Countries</h2>
              <div className="flex flex-wrap gap-1 text-xs">
                {selectedCountries.map(({ id, label }) => (
                  <div
                    key={id}
                    className="rounded-full bg-itc-green-100 px-2 py-1"
                  >
                    {label}
                    <span className="ml-1">
                      (
                      {
                        projects.filter((d) =>
                          d.countries.map((d) => d.isoAlpha3).includes(id),
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
