import * as d3 from "d3";
import { geoSatellite } from "d3-geo-projection";
import { Feature, FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import * as topojson from "topojson-client";
import Iso from "../../components/Iso";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import Mark from "../../components/Mark";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PatternDot from "../../components/PatternDot";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../lib/data/queries/country/getCountryWithProjectCount";
import themes, { ThemeNames } from "../../lib/styles/themes";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { MapOptions } from "../../types/MapOptions";
import { SharedPageProps } from "../../types/Props";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";

type Props = {
  countriesWithProjectCount: CountryWithProjectCount;
} & SharedPageProps;

const ProjectCountries: NextPage<Props> = ({
  countriesWithProjectCount,
  countries,
  neCountriesTopoJson,
}) => {
  const mapOptions: MapOptions = {
    bounds: {
      width: 1080,
      height: 550,
    },
    projection: geoSatellite()
      .scale(1280)
      .rotate([-20, -15, 180])
      .tilt(10)
      .distance(2)
      .translate([1080 / 2, 750]),
    theme: themes.get(ThemeNames.RAISZ) ?? defaultTheme,
  };

  const minHeight = 2;
  const maxHeight = 150;

  const countrySelection = countriesWithProjectCount.filter(
    (d) => d.unRegionCode === "002",
  );

  const projectCount = countrySelection.map((d) => d._count.projects);
  const minRange = d3.min(projectCount) ?? 0; // TODO: meaningful fallback values
  const maxRange = d3.max(projectCount) ?? 10;

  const scale = d3
    .scaleLinear()
    .domain([minRange, maxRange])
    .range([minHeight, maxHeight]);

  const points: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: topojson
      .feature(
        neCountriesTopoJson,
        neCountriesTopoJson.objects.ne_admin_0_countries,
      )
      .features.map((feature) => {
        const value = countrySelection.find(
          (d) => d.isoAlpha3 === feature.properties?.ADM0_A3_NL,
        )?._count.projects;
        const pointFeature: Feature<Point> = {
          type: "Feature",
          properties: {
            projectCount: value,
            ...feature.properties,
          },
          geometry: {
            type: "Point",
            coordinates: [
              d3.geoCentroid(feature)[0],
              d3.geoCentroid(feature)[1],
            ],
          },
        };
        return pointFeature;
      })
      .filter((feature) => feature.properties?.projectCount),
  };

  const polygons = {
    type: "FeatureCollection",
    features: topojson
      .feature(
        neCountriesTopoJson,
        neCountriesTopoJson.objects.ne_admin_0_countries,
      )
      .features.filter((feature) => {
        const matchedCountry = countries.find(
          (d) => d.isoAlpha3 === feature.properties?.ADM0_A3_NL,
        );
        const highlight = matchedCountry?.ldc;
        return highlight;
      }),
  };

  return (
    <PageBase title="ITC's Projects in Sub-Saharan Africa">
      <Container>
        <main>
          {/* TODO: implement projection transform (not only defining the extent with MapLayout) */}
          <MapLayoutFluid
            projection={mapOptions.projection}
            extent={{
              type: "Feature",
              geometry: {
                type: "MultiPoint",
                coordinates: [
                  [-21, 10],
                  [24, -44],
                  [55, 14],
                ],
              },
              properties: {},
            }}
          >
            <defs>
              <PatternDot
                style={mapOptions.theme.choropleth?.pattern}
                angle={0}
                spacing={2}
                fill={"red"}
              ></PatternDot>
            </defs>
            <MapLayerBase
              countries={neCountriesTopoJson}
              theme={mapOptions.theme}
              labels
            />
            <g className="choroplethLayer">
              {polygons.features.map((feature, idx) => (
                <MarkGeometry
                  key={`${feature.properties.ADM0_A3_NL}-${idx}`}
                  feature={feature}
                  fill={"url(#Dots)"}
                />
              ))}
            </g>
            <g className="symbolLayer">
              {points.features.map(({ properties, geometry }, idx) => (
                <Mark
                  longitude={geometry.coordinates[0]}
                  latitude={geometry.coordinates[1]}
                  key={idx}
                >
                  <Iso
                    scaleHeight={scale}
                    value={properties?.projectCount}
                    side={5}
                    style={{
                      ...mapOptions.theme.symbol,
                      stroke: "blue",
                      fillOpacity: 1,
                    }}
                    label={true}
                  />
                </Mark>
              ))}
            </g>
          </MapLayoutFluid>
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const countriesWithProjectCount = await getCountryWithProjectCount();
  const countries = await getCountryCodes();
  const neCountriesTopoJson = getCountries("50m");

  return {
    props: {
      countriesWithProjectCount,
      countries,
      neCountriesTopoJson,
    },
  };
};

export default ProjectCountries;
