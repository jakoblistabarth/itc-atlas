import { scaleSqrt } from "d3";
import { geoInterruptedMollweide } from "d3-geo-projection";
import type { FeatureCollection, Point } from "geojson";
import { nanoid } from "nanoid";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import BaseLayer from "../../components/map/BaseLayer";
import LegendTitle from "../../components/map/LegendTitle";
import NominalLegend from "../../components/map/NominalLegend";
import ScaledPie from "../../components/map/ScaledPie";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import getCountries from "../../lib/data/getCountries";
import getPhdCandidatesByCountryByDepartment from "../../lib/data/getPhdCandidatesByCountryByDepartment";
import { departmentColors } from "../../lib/mappings/departments";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import styles from "../../styles/home.module.css";
import { SharedPageProps } from "../../types/Props";

type Props = {
  data: FeatureCollection<Point>;
  legendEntries: any;
  domain: [number, number];
} & SharedPageProps;

const PhdDepartments: NextPage<Props> = ({
  neCountriesTopoJson,
  data,
  legendEntries,
  domain,
}) => {
  const dimension = {
    width: 1280,
    height: 0,
  };

  const theme = defaultTheme;
  const projection = geoInterruptedMollweide();
  dimension.height = getMapHeight(dimension.width, projection);

  const scale = scaleSqrt().domain(domain).range([1, 100]);

  return (
    <>
      <Head>
        <title>ITC's PhD candidates</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC's PhD candidates</Heading>
        <svg width={dimension.width} height={dimension.height}>
          <BaseLayer
            countries={neCountriesTopoJson}
            projection={projection}
            theme={theme}
          />
          <g id="symbols">
            {data.features.map((point) => {
              if (!point.properties?.departments) return;
              return (
                <ScaledPie
                  key={nanoid()}
                  xy={projection(point.geometry.coordinates)}
                  scale={scale}
                  colorScheme={Object.values(departmentColors)}
                  pieSize={point.properties?.totalPhdCount}
                  data={point.properties?.departments}
                  style={theme.scaledPie}
                />
              );
            })}
          </g>
          <NominalLegend title={"ITC's departments"} entries={legendEntries} />
          <g transform={`translate(${dimension.width - 170},0)`}>
            <LegendTitle>Top 5 PhD countries</LegendTitle>
            {data.features.slice(0, 5).map((feature, index) => (
              <g
                fontSize={10}
                transform={`translate(0, ${40 + index * 15})`}
                key={nanoid()}
              >
                <text>
                  {feature.properties?.NAME_EN}
                  <tspan> ({feature.properties?.totalPhdCount})</tspan>
                </text>
              </g>
            ))}
          </g>
        </svg>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [{ data, domain, legendEntries }] = await Promise.all([
    getPhdCandidatesByCountryByDepartment(),
  ]);

  return {
    props: {
      data,
      domain,
      legendEntries,
      neCountriesTopoJson,
    },
  };
};

export default PhdDepartments;
