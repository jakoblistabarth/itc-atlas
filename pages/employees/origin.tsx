import { Country } from "@prisma/client";
import prisma from "../../prisma/client";
import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { Feature, FeatureCollection, Point } from "geojson";
import { nanoid } from "nanoid";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Vector2 } from "three";
import Footer from "../../components/Footer";
import { Container, Heading } from "theme-ui";
import BaseLayer from "../../components/map/BaseLayer";
import PointSymbol from "../../components/map/PointSymbol";
import ProportionalCircleLegend from "../../components/map/ProportionalCircleLegend";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountries from "../../lib/data/getCountries";
import getCountryWithEmployeeCount, {
  CountryWithEmployeeCount,
} from "../../lib/data/queries/country/getCountryWithEmployeeCount";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { SharedPageProps } from "../../types/Props";

type Props = {
  countryWithEmployeeCount: CountryWithEmployeeCount;
  neCountriesTopoJson: NeCountriesTopoJson;
  countries: Country[];
} & SharedPageProps;

const StaffOrigin: NextPage<Props> = ({
  countryWithEmployeeCount,
  neCountriesTopoJson,
  countries,
}) => {
  const dimension = {
    width: 1280,
    height: 0,
  };

  const projection = geoBertin1953();
  dimension.height = getMapHeight(dimension.width, projection);

  const points: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: countryWithEmployeeCount
      .map((d) => {
        const centroid = getCentroidByIsoCode(d.isoAlpha3)?.toArray(); //TODO: what to do when getCetroidByIsoCode() returns undefined? example SSD – Southsudan
        const coordinates = centroid ?? [0, 0];
        const pointFeature: Feature<Point> = {
          type: "Feature",
          properties: {
            employeeCount: d._count.employees,
            isoAlpha3: d.isoAlpha3,
            nameLongEn: d.nameLongEn,
          },
          geometry: {
            type: "Point",
            coordinates,
          },
        };
        return pointFeature;
      })
      .filter((feature: Feature) => feature.properties?.employeeCount)
      .sort((a: Feature, b: Feature) =>
        d3.descending(a.properties?.employeeCount, b.properties?.employeeCount)
      ),
  };

  const employeeCount = countryWithEmployeeCount.map((d) => d._count.employees);
  const min = d3.min(employeeCount);
  const max = d3.max(employeeCount);

  const scale = d3
    .scaleSqrt()
    .domain([min ?? 0, max ?? 100])
    .range([1, dimension.width / 30]);

  return (
    <>
      <Head>
        <title>ITC&apos;s employee origin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">ITC&apos;s employee origin</Heading>
          <svg width={dimension.width} height={dimension.height}>
            <BaseLayer
              countries={neCountriesTopoJson}
              projection={projection}
            />
            <g id="symbols">
              {points.features.map((point) => {
                const pos = projection(point.geometry.coordinates);
                return (
                  <PointSymbol
                    key={nanoid()}
                    position={new Vector2(pos[0], pos[1])}
                    radius={scale(point.properties?.employeeCount)}
                  />
                );
              })}
            </g>
            <ProportionalCircleLegend
              data={points.features.map(
                (feature) => feature.properties?.employeeCount
              )}
              scaleRadius={scale}
              title={"Staff members per Country"}
              unitLabel={"Staff member"}
            />
          </svg>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [countryWithEmployeeCount, neCountriesTopoJson, countries] =
    await Promise.all([
      getCountryWithEmployeeCount(),
      getCountries(),
      prisma.country.findMany(),
    ]);

  return {
    props: {
      countryWithEmployeeCount,
      countries,
      neCountriesTopoJson,
    },
  };
};

export default StaffOrigin;
