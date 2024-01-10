import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import { feature } from "topojson-client";
import BhosGradientDefs from "../../components/visuals/BhosGradientsDefs";
import { BhosCountry } from "../../types/BhosCountry";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import LegendNominal from "../LegendNominal";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkGeometry from "../MarkGeometry";
import useBhosCategories from "../visuals/useBhosCategories";

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

  const geometries = feature(countries, countries.objects.ne_admin_0_countries);

  return (
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
              d.isoAlpha3 === f.properties.ADM0_A3_NL && d.cabinet === cabinet,
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
              stroke="white"
            />
          );
        })}
      </g>
      <LegendNominal
        transform="translate(10 10)"
        entries={bhosCountries
          .filter((d) => d.cabinet === "Rutte IV")
          .reduce((acc: { label: string; color: string }[], { category }) => {
            if (acc.map((d) => d.label).includes(category)) return acc;
            return [...acc, { label: category, color: colorScale(category) }];
          }, [])}
      />
    </MapLayoutFluid>
  );
};

export default DutchDevelopmentPolicies;
