import { geoBertin1953 } from "d3-geo-projection";
import { FC, useState } from "react";
import { feature } from "topojson-client";
import BhosGradientDefs from "../../components/visuals/BhosGradientsDefs";
import { BhosCountry } from "../../types/BhosCountry";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import LegendNominal from "../LegendNominal";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkGeometry from "../MarkGeometry";
import useBhosCategories from "../visuals/useBhosCategories";
import Callout from "../Callout";
import { HiCursorClick } from "react-icons/hi";

type Props = {
  countries: NeCountriesTopoJson;
  cabinet: string;
  bhosCountries: BhosCountry[];
};

const DutchDevelopmentPolicies: FC<Props> = ({
  countries,
  cabinet,
  bhosCountries,
}) => {
  const {
    colorScale,
    bhosCountriesWithCategories,
    getCategoryKey,
    categoryCombinations,
  } = useBhosCategories(bhosCountries);

  const [selectedCategories, setselectedCategories] = useState<string[]>([]);

  const legendEntries = bhosCountries
    .filter((d) => d.cabinet === "Rutte IV")
    .reduce((acc: { label: string; color: string }[], { category }) => {
      if (acc.map((d) => d.label).includes(category)) return acc;
      return [
        ...acc,
        {
          label: category,
          color: colorScale(category),
          active: selectedCategories.includes(category),
        },
      ];
    }, []);

  const handleEntryClick = (category: string) => {
    setselectedCategories((categories) => {
      // remove if already in array
      if (categories.includes(category))
        return [...categories.filter((d) => d !== category)];
      // reset to empty array if clicked item is the only missing one
      if (
        !categories.includes(category) &&
        categories.length === legendEntries.length - 1
      )
        return [];
      return [...categories, category];
    });
  };

  const geometries = feature(countries, countries.objects.ne_admin_0_countries);

  return (
    <>
      <Callout Icon={HiCursorClick}>
        Click on the legend to highlight one or multiple cateogries.
      </Callout>
      <MapLayoutFluid projection={geoBertin1953()}>
        <BhosGradientDefs
          categoryCombinations={categoryCombinations}
          getCategoryKey={getCategoryKey}
          colorScale={colorScale}
        />

        <MapLayerBase countries={countries} />
        <g>
          {geometries.features.map((f, idx) => {
            const bhosCountry = bhosCountriesWithCategories.find(
              (d) =>
                d.isoAlpha3 === f.properties.ADM0_A3_NL &&
                d.cabinet === cabinet,
            );
            return (
              <MarkGeometry
                key={`${f.properties.ADM0_A3_NL}-${idx}`}
                feature={f}
                fill={
                  bhosCountry?.categories
                    ? `url(#${getCategoryKey(bhosCountry.categories)})`
                    : "transparent"
                }
                opacity={
                  selectedCategories.length &&
                  !selectedCategories.some(
                    (d) => bhosCountry?.categories.includes(d),
                  )
                    ? 0.1
                    : 1
                }
                stroke="white"
              />
            );
          })}
        </g>
        <LegendNominal
          transform="translate(0 12)"
          fontSize={12}
          onEntryClick={handleEntryClick}
          entries={legendEntries}
        />
      </MapLayoutFluid>
    </>
  );
};

export default DutchDevelopmentPolicies;
