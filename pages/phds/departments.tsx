import { max, min, scaleSqrt } from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";
import LegendNominal from "../../components/LegendNominal";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkScaledPieChart from "../../components/MarkScaledPieChart";
import PageBase from "../../components/PageBase";
import getCountries from "../../lib/data/getCountries";
import getPhdsByCountryByDepartment from "../../lib/data/queries/phd/getPhdsByCountryByDepartment";
import { departmentColorScale } from "../../lib/styles/departmentColorScale";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import prisma from "../../prisma/client";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";

type Props = {
  phdsByCountryByDepartment: Awaited<
    ReturnType<typeof getPhdsByCountryByDepartment>
  >;
} & SharedPageProps;

const PhdDepartments: NextPage<Props> = ({
  neCountriesTopoJson,
  phdsByCountryByDepartment,
}) => {
  const [isChecked, setIsChecked] = useState(false); //TODO: use more specific name "isFiltered"

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  const filter = isChecked ? "?graduated=true" : ""; //TODO: switch only true/false no separate variable?

  const { data, error, isLoading } = useSWRImmutable<
    Awaited<ReturnType<typeof getPhdsByCountryByDepartment>>
  >("/api/data/phd/by-country" + filter);

  if (error) return <div>failed to load</div>;

  const mapData = data ?? phdsByCountryByDepartment;

  const dimension = {
    width: 1280,
    height: 0,
  };

  const theme = defaultTheme;
  const projection = geoInterruptedMollweide();

  const phdCount = mapData.map((d) => d.totalCount, 0);
  const minCount = min(phdCount) ?? 0;
  const maxCount = max(phdCount) ?? 10;
  const scale = scaleSqrt().domain([minCount, maxCount]).range([5, 50]);

  const legendEntries = departmentColorScale.domain().map((d) => {
    return {
      label: d,
      color: departmentColorScale(d),
    };
  });

  return (
    <PageBase title="ITC's PhDs">
      <Container>
        <main>
          <div>
            <input
              type="checkbox"
              id="filter"
              // name="filter"
              // value="filter"
              checked={isChecked}
              onChange={handleOnChange}
            />
            <label htmlFor="filter">Show only graduates</label>
          </div>
          <MapLayoutFluid projection={projection}>
            <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
            {!isLoading && (
              <g id="symbols">
                {mapData.map((country) => {
                  if (!country.departments) return;
                  return (
                    <MarkScaledPieChart
                      key={country.isoAlpha3}
                      longitude={country.coordinates[0]}
                      latitude={country.coordinates[1]}
                      radius={scale(country.totalCount)}
                      colorScale={departmentColorScale}
                      data={country.departments}
                      stroke="lightgrey"
                    />
                  );
                })}
              </g>
            )}
            <LegendNominal
              title={"ITC's departments"}
              entries={legendEntries}
            />
            <g transform={`translate(${dimension.width - 170},0)`}>
              <LegendNominal
                title={"Top 5 PhD countries"}
                entries={mapData.slice(0, 5).map((d) => ({
                  label: `${d.countryName} (${d.totalCount})`,
                  color: "none",
                  symbol: <g></g>,
                }))}
              />
            </g>
          </MapLayoutFluid>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [countries, phdsByCountryByDepartment] = await Promise.all([
    prisma.country.findMany(),
    getPhdsByCountryByDepartment(),
  ]);

  return {
    props: {
      countries,
      phdsByCountryByDepartment,
      neCountriesTopoJson,
    },
  };
};

export default PhdDepartments;
