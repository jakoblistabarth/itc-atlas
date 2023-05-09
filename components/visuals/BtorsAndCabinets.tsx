/** @jsxImportSource theme-ui */

import { FC, useState } from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import BtorsByYear from "./charts/BtorsByYear";
import { BtorsGroupedByYear } from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { BhosCountry } from "../../types/BhosCountry";
import { Box, Button, Flex, Text } from "theme-ui";
import { DutchCabinet } from "../../types/DutchCabinet";
import MapLayout from "../map/layout/MapLayout";
import BaseLayer from "../map/BaseLayer";
import { geoBertin1953 } from "d3-geo-projection";
import { feature } from "topojson-client";
import PolygonSymbol from "../map/PolygonSymbol";
import { Feature } from "geojson";
import { HiCursorClick } from "react-icons/hi";
import { scaleOrdinal } from "d3";
import NominalLegend from "../map/NominalLegend";

type Props = {
  neCountries: NeCountriesTopoJson;
  btorsByYear: BtorsGroupedByYear;
  bhosCountries: BhosCountry[];
  dutchCabinets: DutchCabinet[];
};

const BtorsAndCabinets: FC<Props> = ({
  btorsByYear,
  bhosCountries,
  dutchCabinets,
  neCountries,
}) => {
  const rutteCabinets = dutchCabinets.filter((d) => /^Rutte/.test(d.name));
  const [activeCabinet, setActiveCabinet] = useState(rutteCabinets[0].name);

  const categories = bhosCountries.reduce((acc: string[], d) => {
    if (!acc.includes(d.category)) acc.push(d.category);
    return acc;
  }, []);

  const colorScale = scaleOrdinal<string, string>()
    .domain(categories)
    .range(["lightgrey", "gold", "orange", "red", "cornflowerblue"]);

  const projection = geoBertin1953();
  const countries = feature(
    neCountries,
    neCountries.objects.ne_admin_0_countries
  );

  const selectedBhosCountries = bhosCountries.filter(
    (d) => d.cabinet === activeCabinet
  );
  const bhosCountryFeatures: Feature[] = selectedBhosCountries.flatMap(
    (d, idx) => {
      const match = countries.features.find(
        (country) => d.isoAlpha3 === country.properties.ADM0_A3
      );
      return !match
        ? []
        : [
            {
              type: "Feature",
              properties: {
                id: idx,
                ...d,
              },
              geometry: match.geometry,
            },
          ];
    }
  );

  return (
    <div>
      <Box sx={{ background: "muted", p: 2, my: 2, borderRadius: 2 }}>
        <Text as="p">
          <HiCursorClick sx={{ mr: 1 }} />
          Select cabinet of interest.
        </Text>
      </Box>
      <Flex sx={{ gap: 2, mt: 2, mb: 3 }}>
        {rutteCabinets.map((d) => (
          <Button
            variant="muted"
            key={d.name}
            sx={{
              borderWidth: 1,
              borderColor: activeCabinet === d.name ? "primary" : "transparent",
              borderStyle: "solid",
            }}
            onClick={() => setActiveCabinet(d.name)}
          >
            {d.name}
          </Button>
        ))}
      </Flex>
      <MapLayout
        bounds={{
          width: 600,
          height: 200,
          frame: undefined,
          mapBody: undefined,
        }}
        projection={projection}
      >
        <BaseLayer countries={neCountries} projection={projection} />
        {bhosCountryFeatures.map((d) => (
          <PolygonSymbol
            key={d.properties?.id}
            feature={d}
            projection={projection}
            stroke="white"
            fill={colorScale(d.properties?.category)}
          />
        ))}
        <g transform="translate(0 10)">
          <NominalLegend
            entries={colorScale
              .domain()
              .filter((d) => d)
              .map((d) => ({
                label: d,
                color: colorScale(d),
              }))}
          />
        </g>
      </MapLayout>
      <BtorsByYear
        activeCabinet={dutchCabinets.find((d) => d.name === activeCabinet)}
        btors={btorsByYear}
        colorScale={colorScale}
        bhosCountries={bhosCountries}
      />
    </div>
  );
};

export default BtorsAndCabinets;
