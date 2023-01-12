import { scaleOrdinal } from "d3";
import { departmentColors } from "../mappings/departments";

const { colorDomain, colorRange } = Object.entries(departmentColors).reduce(
  (acc: { colorDomain: string[]; colorRange: string[] }, [label, color]) => {
    acc.colorDomain.push(label);
    acc.colorRange.push(color);
    return acc;
  },
  { colorDomain: [], colorRange: [] }
);
export const departmentColorScale = scaleOrdinal<string, string>()
  .domain(colorDomain)
  .range(colorRange);
