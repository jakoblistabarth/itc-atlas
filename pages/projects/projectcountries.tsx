import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import { nanoid } from "nanoid";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PatternLines from "../../components/defs/patterns/PatternLines";
import Heading, { Headings } from "../../components/Heading";
import BaseLayer from "../../components/map/BaseLayer";
import PolygonSymbol from "../../components/map/PolygonSymbol";
import PointSymbol from "../../components/map/PointSymbol";
import ProportionalCircleLegend from "../../components/map/ProportionalCircleLegend";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import getCountries from "../../lib/data/getCountries";
import getProjectsPerCountry from "../../lib/data/getProjectsPerCountry";
import themes, { ThemeNames } from "../../lib/styles/themes";
import styles from "../../styles/home.module.css";
import { scaleSqrt } from "d3";
import getCountriesByGroup from "../../lib/data/getCountriesByGroup";
import { UnGrouping } from "../../types/UnsdCodes";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { SharedPageProps } from "../../types/Props";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import Footer from "../../components/Footer";
import { Vector2 } from "three";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";

type Props = {
  data: FeatureCollection<Point>;
  domain: [number, number];
  highlightCountries: NeCountriesGeoJson;
} & SharedPageProps;

const ProjectCountries: NextPage<Props> = ({
  data,
  domain,
  highlightCountries,
  neCountriesTopoJson,
}) => {
  const dimension = {
    width: 1280,
    height: 0,
  };
  const theme = themes.get(ThemeNames.BAYER) ?? defaultTheme; // Question: this seems strange, I know that such theme exists, that's the point of the enum
  const projection = geoBertin1953();
  dimension.height = getMapHeight(dimension.width, projection);
  const scale = scaleSqrt().domain(domain).range([0.5, 40]);

  return (
    <>
      <Head>
        <title>ITC&apos;s Projects</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC&apos;s global project activity</Heading>
        <svg width={dimension.width} height={dimension.height}>
          <defs>
            <PatternLines
              angle={45}
              spacing={10}
              strokeWidth={0.5}
              stroke={theme.choropleth?.pattern?.stroke}
              name={theme.choropleth?.pattern?.id}
            ></PatternLines>
          </defs>
          <BaseLayer
            countries={neCountriesTopoJson}
            projection={projection}
            theme={theme}
          />
          <g className="choroplethLayer">
            {highlightCountries.features.map((feature) => (
              <PolygonSymbol
                key={nanoid()}
                projection={projection}
                feature={feature}
                fill={`url(#${theme.choropleth?.pattern?.id})`}
              />
            ))}
          </g>
          <g className="symbolLayer">
            {data.features.map((feature) => {
              const coordinates = projection(feature.geometry.coordinates);
              const position = new Vector2(coordinates[0], coordinates[1]);
              return (
                <PointSymbol
                  key={nanoid()}
                  position={position}
                  radius={scale(feature.properties?.projectCount)}
                  {...theme.symbol}
                  interactive
                />
              );
            })}
          </g>
          <ProportionalCircleLegend
            key={nanoid()}
            data={data.features.map(
              (feature) => feature.properties?.projectCount ?? 0
            )}
            scaleRadius={scale}
            title={"Projects per Country"}
            unitLabel={"project"}
            style={theme.symbol}
          />
        </svg>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [{ data, domain }, highlightCountries, countries] = await Promise.all([
    getProjectsPerCountry(),
    getCountriesByGroup(UnGrouping.LDC),
    getCountryCodes(),
  ]);

  return {
    props: {
      data,
      domain,
      neCountriesTopoJson,
      highlightCountries,
      countries,
    },
  };
};

export default ProjectCountries;
