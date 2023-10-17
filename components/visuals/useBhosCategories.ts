import { scaleOrdinal } from "d3";
import { BhosCountryWithCategories } from "./BtorsAndCabinets";
import { BhosCountry } from "../../types/BhosCountry";

const useBhosCategories = (countries: BhosCountry[]) => {
  const getCategoryKey = (categories: string[]) =>
    categories.join("-").replaceAll(" ", "");

  const bhosCountriesWithCategories = countries.reduce(
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

  const categories = countries.reduce((acc: string[], d) => {
    if (!acc.includes(d.category)) acc.push(d.category);
    return acc;
  }, []);

  const colorMap = new Map([
    ["General Focus Country", "teal"],
    ["Transition", "turquoise"],
    ["Trade Relations", "rgb(185, 195, 255)"],
  ]);

  const colorScale = scaleOrdinal<string, string>()
    .domain(categories)
    .range(categories.map((d) => colorMap.get(d) ?? "rgb(245,245,245)"));

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
    getCategoryKey,
    bhosCountriesWithCategories,
    colorScale,
    categoryCombinations,
  };
};

export default useBhosCategories;
