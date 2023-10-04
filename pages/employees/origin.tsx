import { Country } from "@prisma/client";
import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import { Container } from "theme-ui";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import PageBase from "../../components/PageBase";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountries from "../../lib/data/getCountries";
import getCountryWithEmployeeCount, {
  CountryWithEmployeeCount,
} from "../../lib/data/queries/country/getCountryWithEmployeeCount";
import prisma from "../../prisma/client";
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
}) => {
  const projection: d3.GeoProjection = geoBertin1953();

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
    .range([1, 30]);

  return (
    <PageBase title="ITC's employee origin">
      <Container>
        <main>
          <MapLayoutFluid projection={projection}>
            <MapLayerBase countries={neCountriesTopoJson} />
            <g id="symbols">
              {points.features.map(({ properties, geometry }, idx) => {
                return (
                  <MarkCircle
                    key={idx}
                    longitude={geometry.coordinates[0]}
                    latitude={geometry.coordinates[1]}
                    radius={scale(properties?.employeeCount)}
                  />
                );
              })}
            </g>
            <LegendProportionalCircle
              data={points.features.map(
                (feature) => feature.properties?.employeeCount
              )}
              scaleRadius={scale}
              title={"Staff members per Country"}
              unitLabel={"Staff member"}
            />
          </MapLayoutFluid>
        </main>
      </Container>
    </PageBase>
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
