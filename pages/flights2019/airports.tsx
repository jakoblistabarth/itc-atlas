import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { FeatureCollection, Point } from "geojson";
import { Container, Heading } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import MapLayerBase from "../../components/MapLayerBase";
import LabelPoint from "../../components/LabelPoint";
import MarkCircle from "../../components/MarkCircle";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { SharedPageProps } from "../../types/Props";
import { Vector2 } from "three";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import Tooltip from "../../components/Tooltip/";
import { TooltipTrigger } from "../../components/Tooltip/TooltipTrigger";
import TooltipContent from "../../components/Tooltip/TooltipContent";
import { fInt } from "../../lib/utilities/formaters";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import Footer from "../../components/Footer";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";

type Props = {
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const Airports: NextPage<Props> = ({ airports, neCountriesTopoJson }) => {
  const projection = geoBertin1953();

  const airportsGeo: FeatureCollection<Point, AirportPropertiesWithCount> = {
    type: "FeatureCollection",
    features: airports.features.sort((a, b) =>
      d3.descending(a.properties?.value, b.properties?.value)
    ),
  };

  const flightCount = airportsGeo.features.map(
    (feature) => feature.properties.value
  );
  const minRange = d3.min(flightCount);
  const maxRange = d3.max(flightCount);
  const scale = d3
    .scaleSqrt()
    .domain([minRange ?? 0, maxRange ?? 10])
    .range([0, 30]);

  return (
    <>
      <Head>
        <title>Airports</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">Airports</Heading>
          <MapLayoutFluid projection={projection}>
            <MapLayerBase countries={neCountriesTopoJson} />
            {airportsGeo.features.map(({ geometry, properties }) => {
              return (
                <Tooltip key={properties.iata_code}>
                  <TooltipContent>
                    <strong>{properties?.["iata_code"]}</strong>
                    &nbsp;{properties?.name}
                    <br />
                    {fInt(properties?.value)} flights (incoming/outgoing)
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <g>
                      <MarkCircle
                        longitude={geometry.coordinates[0]}
                        latitude={geometry.coordinates[1]}
                        radius={scale(properties?.value)}
                        {...defaultTheme.symbol}
                      />
                    </g>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
            {airportsGeo.features.slice(0, 5).map((airport) => {
              const coords = projection(airport.geometry.coordinates);
              return (
                <LabelPoint
                  key={airport.properties.iata_code}
                  position={new Vector2(coords[0], coords[1])}
                >
                  <tspan fontWeight={"bold"}>
                    {airport.properties?.["iata_code"]}
                  </tspan>
                  ({airport.properties?.value})
                </LabelPoint>
              );
            })}
            <g>
              <LegendProportionalCircle
                data={airports.features.map(
                  (feature) => feature.properties?.value
                )}
                scaleRadius={scale}
                title={"Flights per Airport"}
                unitLabel={"flight"}
                showFunction={false}
              />
            </g>
          </MapLayoutFluid>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [airports, countries] = await Promise.all([
    getFlightsPerAirport(),
    getCountryCodes(),
  ]);

  return {
    props: {
      airports,
      countries,
      neCountriesTopoJson,
    },
  };
};

export default Airports;
