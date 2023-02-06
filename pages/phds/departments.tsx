import { PrismaClient } from "@prisma/client";
import { max, min, scaleSqrt } from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import { nanoid } from "nanoid";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Vector2 } from "three";
import { departmentColorScale } from "../../lib/styles/departmentColorScale";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import BaseLayer from "../../components/map/BaseLayer";
import NominalLegend from "../../components/map/NominalLegend";
import ScaledPie from "../../components/map/ScaledPie";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import getCountries from "../../lib/data/getCountries";
import getPhdCandidatesByCountryByDepartment from "../../lib/data/getPhdCandidatesByCountryByDepartment";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import styles from "../../styles/home.module.css";
import { SharedPageProps } from "../../types/Props";
import useSWR from "swr";
import { useState } from "react";

type Props = {
  phdsByCountryByDepartment: Awaited<
    ReturnType<typeof getPhdCandidatesByCountryByDepartment>
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

  const { data, error, isLoading } = useSWR(
    "/api/data/phd-candidate/by-country" + filter
  );

  if (error) return <div>failed to load</div>;

  const mapData =
    (data as Awaited<
      ReturnType<typeof getPhdCandidatesByCountryByDepartment>
    >) ?? phdsByCountryByDepartment;

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
        <title>ITC&apos;s PhD candidates</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC&apos;s PhD candidates</Heading>
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
          <BaseLayer
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
                    key={nanoid()}
                    position={new Vector2(pos[0], pos[1])}
                    radius={scale(country.totalCount)}
                    color={departmentColorScale}
                    data={country.departments}
                    style={theme.scaledPie}
                  />
                );
              })}
            </g>
          )}
          <NominalLegend
            title={"ITC&apos;s departments"}
            entries={legendEntries}
          />
          <g transform={`translate(${dimension.width - 170},0)`}>
            <NominalLegend
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
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const prisma = new PrismaClient();
  const [countries, phdsByCountryByDepartment] = await Promise.all([
    prisma.country.findMany(),
    getPhdCandidatesByCountryByDepartment(),
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
