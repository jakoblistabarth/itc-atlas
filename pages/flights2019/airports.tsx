import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import { Vector2 } from "three";
import LabelPoint from "../../components/LabelPoint";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import PageBase from "../../components/PageBase";
import Tooltip from "../../components/Tooltip/";
import TooltipContent from "../../components/Tooltip/TooltipContent";
import { TooltipTrigger } from "../../components/Tooltip/TooltipTrigger";
import getCountries from "../../lib/data/getCountries";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { fInt } from "../../lib/utilities/formaters";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";

type Props = {
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const Airports: NextPage<Props> = ({ airports, neCountriesTopoJson }) => {
  const projection = geoBertin1953();

  const airportsGeo: FeatureCollection<Point, AirportPropertiesWithCount> = {
    type: "FeatureCollection",
    features: airports.features.sort((a, b) =>
      d3.descending(a.properties?.value, b.properties?.value),
    ),
  };

  const flightCount = airportsGeo.features.map(
    (feature) => feature.properties.value,
  );
  const minRange = d3.min(flightCount);
  const maxRange = d3.max(flightCount);
  const scale = d3
    .scaleSqrt()
    .domain([minRange ?? 0, maxRange ?? 10])
    .range([0, 30]);

  return (
    <PageBase title="Airports">
      <Container>
        <main>
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
                  (feature) => feature.properties?.value,
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
    </PageBase>
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
