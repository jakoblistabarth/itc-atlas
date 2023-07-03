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
  const [activeCountry, setActiveCountry] = useState<string | undefined>(
    undefined
  );
  for (let i = 0; i < bhosCountries.length; i++) {
    for (let j = i + 1; j < bhosCountries.length; j++) {
      if (
        bhosCountries[i].cabinet == bhosCountries[j].cabinet &&
        bhosCountries[i].countryName == bhosCountries[j].countryName &&
        bhosCountries[i].isoAlpha3 == bhosCountries[j].isoAlpha3
      ) {
        bhosCountries[i].category =
          bhosCountries[i].category + "," + bhosCountries[j].category;
        bhosCountries.splice(j, 1);
      }
    }
  }
  const categories = bhosCountries.reduce((acc: string[], d) => {
    if (!acc.includes(d.category) && !d.category.includes(","))
      acc.push(d.category);
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
          width: 800,
          height: 275,
          frame: undefined,
          mapBody: undefined,
        }}
        projection={projection}
      >
        <BaseLayer countries={neCountries} projection={projection} />
        {bhosCountryFeatures.map((d, idx) => (
          <g key={d.properties?.id}>
            <defs>
              <linearGradient
                id={"grad" + idx}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                {("" + d.properties?.category).split(",").map((d, idx, arr) => (
                  <stop
                    key={idx}
                    offset={
                      arr.length < 3 ? 1 / arr.length : (1 / arr.length) * idx
                    }
                    style={{ stopColor: colorScale(d), stopOpacity: "1" }}
                  />
                ))}
              </linearGradient>
            </defs>
            <PolygonSymbol
              feature={d}
              projection={projection}
              stroke="white"
              cursor="pointer"
              fill={"url(#grad" + idx + ")"}
              onMouseOver={() => setActiveCountry(d.properties?.isoAlpha3)}
              onMouseLeave={() => setActiveCountry(undefined)}
              sx={{ transition: "opacity .5s" }}
              opacity={
                activeCountry && activeCountry !== d.properties?.isoAlpha3
                  ? 0.05
                  : 1
              }
            />
          </g>
        ))}
        <NominalLegend
          transform="translate(0 10)"
          fontSize={10}
          entries={colorScale
            .domain()
            .filter((d) => d)
            .map((d) => ({
              label: d,
              color: colorScale(d),
            }))}
        />
      </MapLayout>
      <BtorsByYear
        activeCabinet={dutchCabinets.find((d) => d.name === activeCabinet)}
        activeCountry={activeCountry}
        btors={btorsByYear}
        colorScale={colorScale}
        bhosCountries={bhosCountries}
        mouseEnterLeaveHandler={(isoAlpha3?: string) =>
          setActiveCountry(isoAlpha3)
        }
      />
    </div>
  );
};

export default BtorsAndCabinets;
