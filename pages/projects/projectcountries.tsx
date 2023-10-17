import { scaleSqrt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import Footer from "../../components/Footer";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PatternLine from "../../components/PatternLine";
import getCountries from "../../lib/data/getCountries";
import getCountriesByGroup from "../../lib/data/getCountriesByGroup";
import getProjectsPerCountry from "../../lib/data/getProjectsPerCountry";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import themes, { ThemeNames } from "../../lib/styles/themes";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { SharedPageProps } from "../../types/Props";
import { UnGrouping } from "../../types/UnsdCodes";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";

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
  const theme = themes.get(ThemeNames.BAYER) ?? defaultTheme; // Question: this seems strange, I know that such theme exists, that's the point of the enum
  const projection = geoBertin1953();
  const scale = scaleSqrt().domain(domain).range([0.5, 40]);

  return (
    <PageBase title="ITC's global project activity">
      <Container>
        <main>
          <MapLayoutFluid projection={projection}>
            <defs>
              <PatternLine
                angle={45}
                spacing={10}
                strokeWidth={0.5}
                stroke={theme.choropleth?.pattern?.stroke}
                name={theme.choropleth?.pattern?.id}
              ></PatternLine>
            </defs>
            <MapLayerBase countries={neCountriesTopoJson} theme={theme} />
            <g className="choroplethLayer">
              {highlightCountries.features.map((feature) => (
                <MarkGeometry
                  key={feature.properties.ADM0_A3}
                  feature={feature}
                  fill={`url(#${theme.choropleth?.pattern?.id})`}
                />
              ))}
            </g>
            <g className="symbolLayer">
              {data.features.map((feature, idx) => {
                return (
                  <MarkCircle
                    key={idx}
                    longitude={feature.geometry.coordinates[0]}
                    latitude={feature.geometry.coordinates[1]}
                    radius={scale(feature.properties?.projectCount)}
                    {...theme.symbol}
                    interactive
                  />
                );
              })}
            </g>
            <LegendProportionalCircle
              data={data.features.map(
                (feature) => feature.properties?.projectCount ?? 0,
              )}
              scaleRadius={scale}
              title={"Projects per Country"}
              unitLabel={"project"}
              style={theme.symbol}
            />
          </MapLayoutFluid>
        </main>
      </Container>
      <Footer />
    </PageBase>
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
