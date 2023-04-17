import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { FeatureCollection, Point } from "geojson";
import { Container, Heading } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import BaseLayer from "../../components/map/BaseLayer";
import PointLabel from "../../components/map/PointLabel";
import PointSymbol from "../../components/map/PointSymbol";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { SharedPageProps } from "../../types/Props";
import { nanoid } from "nanoid";
import { Vector2 } from "three";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import Tooltip from "../../components/Tooltip/Tooltip";
import { TooltipTrigger } from "../../components/Tooltip/TooltipTrigger";
import TooltipContent from "../../components/Tooltip/TooltipContent";
import { fInt } from "../../lib/utilities/formaters";
import ProportionalCircleLegend from "../../components/map/ProportionalCircleLegend";
import Footer from "../../components/Footer";

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
          <svg width={1020} height={600}>
            <BaseLayer
              countries={neCountriesTopoJson}
              projection={projection}
            />
            {airportsGeo.features.map((airport) => {
              const coords = projection(airport.geometry.coordinates);
              return (
                <Tooltip key={nanoid()}>
                  <TooltipContent>
                    <strong>{airport.properties?.["iata_code"]}</strong>
                    &nbsp;{airport.properties?.name}
                    <br />
                    {fInt(airport.properties?.value)} flights
                    (incoming/outgoing)
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <g>
                      <PointSymbol
                        position={new Vector2(coords[0], coords[1])}
                        radius={scale(airport.properties?.value)}
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
                <PointLabel
                  key={nanoid()}
                  position={new Vector2(coords[0], coords[1])}
                >
                  <tspan fontWeight={"bold"}>
                    {airport.properties?.["iata_code"]}
                  </tspan>
                  ({airport.properties?.value})
                </PointLabel>
              );
            })}
            <g>
              <ProportionalCircleLegend
                data={airports.features.map(
                  (feature) => feature.properties?.value
                )}
                scaleRadius={scale}
                title={"Flights per Airport"}
                unitLabel={"flight"}
                showFunction={false}
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
