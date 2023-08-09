import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import { Container, Heading, Text } from "theme-ui";
import getNfpCountries from "../../lib/data/getNfpCountries";
import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { NfpCountry } from "../../types/NfpCountry";
import MapLayout from "../../components/MapLayout";
import MapLayoutBody from "../../components/MapLayout/MapLayoutBody";
import MapLayerBase from "../../components/MapLayerBase";
import getCountries from "../../lib/data/getCountries";
import { SharedPageProps } from "../../types/Props";
import { feature } from "topojson-client";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import MapLayoutHeader from "../../components/MapLayout/MapLayoutHeader";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";

type Props = {
  nfps: NfpCountry[];
} & SharedPageProps;

const NfpCountries: NextPage<Props> = ({ nfps, neCountriesTopoJson }) => {
  const width = 900;
  const margin = 20;
  const maxSize = 50;

  const yearDomain = d3.extent(
    nfps.map((nfp) => new Date(nfp.year.toString()))
  );
  const perYear = d3.group(nfps, (d) => d.year);
  const countDomain = d3.extent(
    [...Array.from(perYear.values())].map((countries) => countries.length)
  );

  const scale = d3
    .scaleSqrt()
    .domain([countDomain[0] ?? 0, countDomain[1] ?? 100])
    .range([3, maxSize / 2]);
  const scaleTime = d3
    .scaleTime()
    .domain([yearDomain[0] ?? new Date("1900"), yearDomain[1] ?? new Date()])
    .range([0, width - margin * 2 - maxSize * 2]);

  const selectedYears = [2000, 2005, 2009, 2013, 2022];
  const selection = selectedYears.map((y) => perYear.get(y));

  return (
    <>
      <Head>
        <title>NFP Countries</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">NFP Countries</Heading>

          <Text variant="teaser">Insights into NFP Countries.</Text>
          <svg width={width} height={200}>
            <g transform={`translate(${margin}, ${margin})`}>
              {d3
                .range(
                  yearDomain[0]?.getFullYear() ?? 0,
                  (yearDomain[1]?.getFullYear() ?? 0) + 1,
                  1
                )
                .map((year) => {
                  const yearDate = new Date(year.toString());
                  const yearData = perYear.get(year);
                  return (
                    <g
                      key={year}
                      transform={`translate(${scaleTime(
                        yearDate
                      )}, ${maxSize})`}
                    >
                      <circle
                        cx={maxSize}
                        cy={0}
                        r={yearData ? scale(yearData.length) : 1}
                        fill={yearData ? "black" : "lightgrey"}
                        fillOpacity={yearData ? 0.2 : 1}
                        stroke={yearData ? "black" : "none"}
                      />
                      <line
                        x1={maxSize}
                        y1={5}
                        x2={maxSize}
                        y2={maxSize / 2 + 5}
                        strokeWidth={0.5}
                        stroke={"grey"}
                      />
                      <text
                        fontSize={"10"}
                        textAnchor="middle"
                        x={maxSize}
                        y={maxSize / 2 + 20}
                      >
                        {year}
                      </text>
                    </g>
                  );
                })}
            </g>
          </svg>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1em 1em",
            }}
          >
            {selection.map((selectedYear, idx) => {
              const nfpCountryCodes = selectedYear?.map((d) => d.countryISO);
              const polygons = feature(
                neCountriesTopoJson,
                neCountriesTopoJson.objects.ne_admin_0_countries
              ).features.filter((f) =>
                nfpCountryCodes?.includes(f.properties.ADM0_A3_NL)
              );

              const projection = geoBertin1953();
              const bounds = {
                width: 300,
                height: 275,
              };
              return (
                <MapLayout key={idx} bounds={bounds} projection={projection}>
                  <MapLayoutHeader
                    bounds={bounds}
                    title={
                      selectedYear ? selectedYear[0]?.year.toString() : " "
                    }
                  />
                  <MapLayoutBody bounds={bounds}>
                    <MapLayerBase
                      countries={neCountriesTopoJson}
                      projection={projection}
                    />
                    <g>
                      {polygons.map((p, idx) => (
                        <MarkGeometry
                          key={`${p.properties.ADM0_A3}-${idx}`}
                          feature={p}
                          projection={projection}
                          style={{ fill: "black" }}
                        />
                      ))}
                    </g>
                  </MapLayoutBody>
                </MapLayout>
              );
            })}
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const nfps = await getNfpCountries();
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();
  return {
    props: {
      nfps,
      neCountriesTopoJson,
      countries,
    },
  };
};

export default NfpCountries;
