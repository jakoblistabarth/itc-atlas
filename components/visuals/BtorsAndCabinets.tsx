/** @jsxImportSource theme-ui */

import { FC, Fragment, useMemo, useState } from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import BtorsByYear from "./charts/BtorsByYear";
import { BtorsGroupedByYear } from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { BhosCountry } from "../../types/BhosCountry";
import { Button, Flex, Text } from "theme-ui";
import { DutchCabinet } from "../../types/DutchCabinet";
import MapLayerBase from "../MapLayerBase";
import { geoBertin1953 } from "d3-geo-projection";
import { feature } from "topojson-client";
import MarkGeometry from "../MarkGeometry/MarkGeometry";
import { Feature } from "geojson";
import { HiCursorClick } from "react-icons/hi";
import { scaleOrdinal } from "d3";
import LegendNominal from "../LegendNominal";
import Callout from "../Callout/Callout";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import Tooltip from "../Tooltip/";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import TooltipContent from "../Tooltip/TooltipContent";
import getCountryName from "../../lib/getCountryName";

type Props = {
  neCountries: NeCountriesTopoJson;
  btorsByYear: BtorsGroupedByYear;
  bhosCountries: BhosCountry[];
  dutchCabinets: DutchCabinet[];
};

export type BhosCountryWithCategories = BhosCountry & { categories: string[] };

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

  const getCategoryKey = (categories: string[]) =>
    categories.join("-").replaceAll(" ", "");

  const { bhosCountriesWithCategories, categoryCombinations, colorScale } =
    useMemo(() => {
      const bhosCountriesWithCategories = bhosCountries.reduce(
        (acc: BhosCountryWithCategories[], d) => {
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

      return {
        bhosCountriesWithCategories,
        colorScale,
        categoryCombinations,
      };
    }, [bhosCountries]);

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

  const countries = useMemo(
    () => feature(neCountries, neCountries.objects.ne_admin_0_countries),
    [neCountries]
  );

  const countriesWithCategories = useMemo(() => {
    const selectedBhosCountries = bhosCountriesWithCategories.filter(
      (d) => d.cabinet === activeCabinet
    );

    const countriesWithCategories: Feature[] = countries.features.map(
      (d, idx) => {
        const match = selectedBhosCountries.find(
          (country) => d.properties.ADM0_A3_NL === country.isoAlpha3
        );
        return {
          ...d,
          properties: {
            id: idx,
            isoAlpha3: d.properties.ADM0_A3_NL,
            categories: match?.categories,
          },
        };
      }
    );
    return countriesWithCategories;
  }, [countries, activeCabinet, bhosCountriesWithCategories]);

  return (
    <div>
      <Callout Icon={HiCursorClick} title="Tipp">
        <Text as="p">
          Select cabinet of interest and hover over countries (or the lines in
          the line chart) to get additional information.
        </Text>
      </Callout>
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
      <svg width={"100%"} height={"50px"}>
        <LegendNominal
          transform="translate(0 10)"
          fontSize={10}
          columnWidth={200}
          columns={3}
          entries={colorScale
            .domain()
            .filter((d) => d)
            .map((d) => ({
              label: d,
              color: colorScale(d),
            }))}
        />
      </svg>
      <MapLayoutFluid projection={projection}>
        <GradientDefs />
        <MapLayerBase countries={neCountries} projection={projection} />
        {countriesWithCategories.map((d) => {
          const isActiveCountry = activeCountry === d.properties?.isoAlpha3;
          return (
            <Tooltip key={d.properties?.id}>
              <TooltipTrigger asChild>
                <g>
                  <MarkGeometry
                    feature={d}
                    projection={projection}
                    stroke={isActiveCountry ? "black" : "white"}
                    strokeLinejoin="round"
                    cursor="pointer"
                    fill={
                      d.properties?.categories
                        ? `url(#${getCategoryKey(d.properties?.categories)})`
                        : "transparent"
                    }
                    onMouseOver={() =>
                      setActiveCountry(d.properties?.isoAlpha3)
                    }
                    onMouseLeave={() => setActiveCountry(undefined)}
                    sx={{ transition: "opacity .5s" }}
                    opacity={
                      !isActiveCountry && !d.properties?.categories ? 0.05 : 1
                    }
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <Text as="h4">
                  {getCountryName(d.properties?.isoAlpha3, neCountries)}
                </Text>
                {d.properties?.categories &&
                  d.properties?.categories.map(
                    (category: string, i: number) => (
                      <svg key={i} width={10} height={10}>
                        <circle
                          transform="translate(5,5)"
                          r={5}
                          fill={colorScale(category)}
                        />
                      </svg>
                    )
                  )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </MapLayoutFluid>
      <BtorsByYear
        activeCabinet={dutchCabinets.find((d) => d.name === activeCabinet)}
        activeCountry={activeCountry}
        btors={btorsByYear}
        colorScale={colorScale}
        bhosCountries={bhosCountriesWithCategories}
        mouseEnterLeaveHandler={(isoAlpha3?: string) =>
          setActiveCountry(isoAlpha3)
        }
        neCountries={neCountries}
      />
    </div>
  );
};

export default BtorsAndCabinets;
