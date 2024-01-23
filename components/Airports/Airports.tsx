import * as d3 from "d3";
import { FC } from "react";
import { geoBertin1953 } from "d3-geo-projection";
import { FeatureCollection, Point } from "geojson";
import { Vector2 } from "three";
import LabelPoint from "../LabelPoint";
import LegendProportionalCircle from "../LegendProportionalCircle";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkCircle from "../MarkCircle";
import Tooltip from "../Tooltip";
import { AirportPropertiesWithCount } from "../../lib/data/getFlightsPerAirport";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { fInt } from "../../lib/utilities/formaters";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

type Props = {
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const Airports: FC<Props> = ({ airports, neCountriesTopoJson }) => {
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
    <MapLayoutFluid projection={projection}>
      <MapLayerBase countries={neCountriesTopoJson} />
      {airportsGeo.features.map(({ geometry, properties }) => {
        return (
          <Tooltip.Root key={properties.iataCode}>
            <Tooltip.Content>
              <strong>{properties?.["iataCode"]}</strong>
              &nbsp;{properties?.name}
              <br />
              {fInt(properties?.value)} flights (incoming/outgoing)
            </Tooltip.Content>
            <Tooltip.Trigger asChild>
              <g>
                <MarkCircle
                  longitude={geometry.coordinates[0]}
                  latitude={geometry.coordinates[1]}
                  radius={scale(properties?.value)}
                  {...defaultTheme.symbol}
                />
              </g>
            </Tooltip.Trigger>
          </Tooltip.Root>
        );
      })}
      {airportsGeo.features.slice(0, 5).map((airport) => {
        const coords = projection(airport.geometry.coordinates);
        return (
          <LabelPoint
            key={airport.properties.iataCode}
            position={new Vector2(coords[0], coords[1])}
          >
            <tspan fontWeight={"bold"}>
              {airport.properties?.["iataCode"]}
            </tspan>
            ({airport.properties?.value})
          </LabelPoint>
        );
      })}
      <g>
        <LegendProportionalCircle
          data={airports.features.map((feature) => feature.properties?.value)}
          scaleRadius={scale}
          title={"Flights per Airport"}
          unitLabel={"flight"}
          showFunction={false}
        />
      </g>
    </MapLayoutFluid>
  );
};

export default Airports;
