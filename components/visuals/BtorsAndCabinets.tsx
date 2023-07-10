/** @jsxImportSource theme-ui */

import { FC, Fragment, useState } from "react";
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

  const bhosCountriesWithCategories = bhosCountries.reduce(
    (acc: (BhosCountry & { categories: string[] })[], d) => {
      const match = acc.find(
        (m) => m.cabinet === d.cabinet && m.isoAlpha3 === d.isoAlpha3
      );
      if (!match) {
        const s = { ...d, categories: [d.category] };
        return [...acc, s];
      }
      match.categories.push(d.category);
      return acc;
    },
    []
  );

  const categories = bhosCountries.reduce((acc: string[], d) => {
    if (!acc.includes(d.category)) acc.push(d.category);
    return acc;
  }, []);

  const colorScale = scaleOrdinal<string, string>()
    .domain(categories)
    .range(["lightgrey", "gold", "orange", "red", "cornflowerblue"]);

  const getCategoryKey = (categories: string[]) =>
    categories.join("-").replaceAll(" ", "");

  const categoryCombinations = bhosCountriesWithCategories.reduce(
    (acc: string[][], d) => {
      return !acc
        .map((e) => getCategoryKey(e))
        .includes(getCategoryKey(d.categories))
        ? [...acc, d.categories]
        : acc;
    },
    []
  );

  const GradientDefs = () => (
    <defs>
      {categoryCombinations.map((d) => {
        const key = getCategoryKey(d);
        return (
          <linearGradient
            id={key}
            key={key}
            gradientUnits="userSpaceOnUse"
            x2={d.length * 2}
            spreadMethod="repeat"
            gradientTransform="rotate(-45)"
          >
            {d.map((category, i) => (
              <Fragment key={`${key}-${category}`}>
                <stop
                  offset={(1 / d.length) * i}
                  stopColor={colorScale(category)}
                />
                <stop
                  offset={(1 / d.length) * (i + 1)}
                  stopColor={colorScale(category)}
                />
              </Fragment>
            ))}
          </linearGradient>
        );
      })}
    </defs>
  );

  const projection = geoBertin1953();

  const countries = feature(
    neCountries,
    neCountries.objects.ne_admin_0_countries
  );

  const selectedBhosCountries = bhosCountriesWithCategories.filter(
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
          width: 700,
          height: 275,
          frame: undefined,
          mapBody: undefined,
        }}
        projection={projection}
      >
        <GradientDefs />
        <BaseLayer countries={neCountries} projection={projection} />
        {bhosCountryFeatures.map((d) => (
          <PolygonSymbol
            key={d.properties?.id}
            feature={d}
            projection={projection}
            stroke="white"
            cursor="pointer"
            fill={`url(#${getCategoryKey(d.properties?.categories)})`}
            onMouseOver={() => setActiveCountry(d.properties?.isoAlpha3)}
            onMouseLeave={() => setActiveCountry(undefined)}
            sx={{ transition: "opacity .5s" }}
            opacity={
              activeCountry && activeCountry !== d.properties?.isoAlpha3
                ? 0.05
                : 1
            }
          />
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
