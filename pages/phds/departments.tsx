import prisma from "../../prisma/client";
import { max, min, scaleSqrt } from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Vector2 } from "three";
import { departmentColorScale } from "../../lib/styles/departmentColorScale";
import Footer from "../../components/Footer";
import { Container, Heading } from "theme-ui";
import MapLayerBase from "../../components/MapLayerBase";
import LegendNominal from "../../components/LegendNominal";
import ScaledPie from "../../components/ScaledPieChart/ScaledPieChart";
import getMapHeight from "../../lib/helpers/getMapHeight";
import getCountries from "../../lib/data/getCountries";
import getPhdsByCountryByDepartment from "../../lib/data/queries/phd/getPhdsByCountryByDepartment";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { SharedPageProps } from "../../types/Props";
import useSWR from "swr";
import { useState } from "react";

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

  const { data, error, isLoading } = useSWR<
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
  dimension.height = getMapHeight(dimension.width, projection);

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
    <>
      <Head>
        <title>ITC&apos;s PhDs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">ITC&apos;s PhDs</Heading>
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
          <svg width={dimension.width} height={dimension.height}>
            <MapLayerBase
              countries={neCountriesTopoJson}
              projection={projection}
              theme={theme}
            />
            {!isLoading && (
              <g id="symbols">
                {mapData.map((country) => {
                  if (!country.departments) return;
                  const pos = projection(country.coordinates);
                  return (
                    <ScaledPie
                      key={country.isoAlpha3}
                      position={new Vector2(pos[0], pos[1])}
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
          </svg>
        </main>
      </Container>
      <Footer />
    </>
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
