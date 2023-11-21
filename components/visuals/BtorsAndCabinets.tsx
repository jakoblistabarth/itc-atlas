import { union } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { Feature } from "geojson";
import { FC, useMemo, useState } from "react";
import { HiCursorClick } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { feature } from "topojson-client";
import { BtorsGroupedByYear } from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import Callout from "../Callout/Callout";
import LegendNominal from "../LegendNominal";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkGeometry from "../MarkGeometry/MarkGeometry";
import Paragraph from "../Paragraph";
import Tooltip from "../Tooltip/";
import TooltipContent from "../Tooltip/TooltipContent";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import BhosGradientDefs from "./BhosGradientsDefs";
import BtorsByYear from "./charts/BtorsByYear";
import useBhosCategories from "./useBhosCategories";

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
  const [activeCabinet, setActiveCabinet] = useState(
    dutchCabinets[dutchCabinets.length - 1].name,
  );
  const [activeCountry, setActiveCountry] = useState<string | undefined>(
    undefined,
  );

  const cabinetsWithBhosData = Array.from(
    union(bhosCountries.map((d) => d.cabinet)),
  );
  const filteredCabinets = dutchCabinets.filter((d) =>
    cabinetsWithBhosData.includes(d.name),
  );

  const {
    bhosCountriesWithCategories,
    categoryCombinations,
    colorScale,
    getCategoryKey,
  } = useBhosCategories(
    bhosCountries.filter((d) =>
      ["General Focus Country", "Transition", "Trade Relations"].includes(
        d.category,
      ),
    ),
  );
  const projection = geoBertin1953();

  const countries = useMemo(
    () => feature(neCountries, neCountries.objects.ne_admin_0_countries),
    [neCountries],
  );

  const countriesWithCategories = useMemo(() => {
    const selectedBhosCountries = bhosCountriesWithCategories.filter(
      (d) => d.cabinet === activeCabinet,
    );

    const countriesWithCategories: Feature[] = countries.features.map(
      (d, idx) => {
        const match = selectedBhosCountries.find(
          (country) => d.properties.ADM0_A3_NL === country.isoAlpha3,
        );
        return {
          ...d,
          properties: {
            id: idx,
            isoAlpha3: d.properties.ADM0_A3_NL,
            countryNameEN: d.properties.NAME_EN,
            categories: match?.categories,
          },
        };
      },
    );
    return countriesWithCategories;
  }, [countries, activeCabinet, bhosCountriesWithCategories]);

  return (
    <div>
      <Callout Icon={HiCursorClick} title="Tipp">
        <Paragraph>
          Select cabinet of interest and hover over countries (or the lines in
          the line chart) to get additional information.
        </Paragraph>
      </Callout>
      <div className="pn-2 scroll mb-2 mt-2 flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
        {filteredCabinets.map((d) => (
          <button
            key={d.name}
            className={twMerge(
              "border-1 min-w-[100px] border-solid",
              activeCabinet === d.name
                ? "border-itc-green"
                : "border-transparent",
            )}
            // sx={{
            //   "&:firstChild": { marginLeft: "auto" },
            //   "&:lastChild": { marginRight: "auto" },
            //   minWidth: 100,
            //   borderWidth: 1,
            //   borderColor: activeCabinet === d.name ? "primary" : "transparent",
            //   borderStyle: "solid",
            // }}
            onClick={() => setActiveCabinet(d.name)}
          >
            {d.name}
          </button>
        ))}
      </div>
      <svg width={"100%"} height={"50px"}>
        <LegendNominal
          transform="translate(0 10)"
          fontSize={10}
          columnWidth={150}
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
        <BhosGradientDefs
          categoryCombinations={categoryCombinations}
          getCategoryKey={getCategoryKey}
          colorScale={colorScale}
        />
        <MapLayerBase countries={neCountries} />
        {countriesWithCategories.map((d) => {
          const isActiveCountry = activeCountry === d.properties?.isoAlpha3;
          return (
            <Tooltip key={d.properties?.id}>
              <TooltipTrigger asChild>
                <g>
                  <MarkGeometry
                    feature={d}
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
                    className="transition-opacity duration-500"
                    opacity={
                      !isActiveCountry && !d.properties?.categories ? 0.05 : 1
                    }
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <h4>{d.properties?.countryNameEN}</h4>
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
                    ),
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
