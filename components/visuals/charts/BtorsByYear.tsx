/** @jsxImportSource theme-ui */

import { FC } from "react";
import useMeasure from "react-use-measure";
import {
  ScaleOrdinal,
  ascending,
  format,
  groups,
  max,
  min,
  scaleLinear,
} from "d3";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import AxisX from "../../charts/Axis/AxisX";
import AxisY from "../../charts/Axis/AxisY";
import RuleY from "../../charts/RuleY";
import { MdArrowUpward } from "react-icons/md";
import { DutchCabinet } from "../../../types/DutchCabinet";
import { BhosCountry } from "../../../types/BhosCountry";

type Props = {
  btors: BtorsGroupedByYear;
  activeCabinet?: DutchCabinet;
  activeCountry?: string;
  colorScale: ScaleOrdinal<string, string>;
  bhosCountries: BhosCountry[];
  mouseEnterLeaveHandler: (isoAlpha3?: string) => void;
};

const BtorsByYear: FC<Props> = ({
  btors,
  activeCabinet,
  activeCountry,
  mouseEnterLeaveHandler,
  colorScale,
  bhosCountries,
}) => {
  const [chartRef, { width }] = useMeasure();

  const chartHeight = 300;
  const margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 20,
  };

  const [cabinetStart, cabinetEnd] = [
    activeCabinet?.dateStart,
    activeCabinet?.dateEnd,
  ].map((d) => (d && d?.length > 0 ? new Date(d) : new Date()));

  const maxCount = max(btors, (d) => d.count) ?? 1;
  const minTime = min(btors, (d) => d.year) ?? 2000;
  const maxTime = max(btors, (d) => d.year) ?? new Date().getFullYear();
  const xScale = scaleLinear()
    .domain([minTime, maxTime])
    .range([margin.left, width - margin.right]);
  const yScale = scaleLinear()
    .domain([0, maxCount])
    .range([chartHeight - margin.bottom, margin.top]);

  const btorsByCountry = groups(btors, (d) => d.isoAlpha3).map((d) => ({
    isoAlpha3: d[0],
    data: d[1],
  }));

  return (
    <svg
      ref={chartRef}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 ${width} ${chartHeight}`}
    >
      <g>
        <MdArrowUpward size={"10"} />
        <text x={"1.5em"} fontSize={10} dominantBaseline={"hanging"}>
          No. of Travels per year
        </text>
      </g>
      {cabinetStart && cabinetEnd && (
        <rect
          x={xScale(cabinetStart.getFullYear())}
          y={yScale(maxCount)}
          height={yScale(0) - yScale(maxCount)}
          sx={{ fill: "muted" }}
          width={
            xScale(cabinetEnd.getFullYear()) -
            xScale(cabinetStart.getFullYear())
          }
        />
      )}
      <RuleY xScale={xScale} yScale={yScale} />
      <AxisX
        top={chartHeight - margin.bottom + 5}
        tickFormat={format("4")}
        xScale={xScale}
      />
      <AxisY left={margin.left} yScale={yScale} />
      <g>
        {btorsByCountry.map((d) => {
          const bhosCountry = bhosCountries
            .filter((d) => d.cabinet === activeCabinet?.name)
            .find((country) => country.isoAlpha3 === d.isoAlpha3);
          const hasCategory = !!bhosCountry?.category;
          return (
            <Group key={d.isoAlpha3}>
              <LinePath
                data={d.data.sort((a, b) => ascending(a.year, b.year))}
                x={(d) => xScale(d.year)}
                y={(d) => yScale(d.count)}
                strokeLinejoin="round"
                strokeWidth={hasCategory ? 2 : 0.5}
                sx={{ transition: "opacity .5s" }}
                cursor="pointer"
                stroke={
                  hasCategory ? colorScale(bhosCountry.category) : "black"
                }
                opacity={
                  activeCountry && d.isoAlpha3 === activeCountry
                    ? 1
                    : !activeCountry && hasCategory
                    ? 1
                    : 0.05
                }
                onMouseEnter={() => mouseEnterLeaveHandler(d.isoAlpha3)}
                onMouseLeave={() => mouseEnterLeaveHandler(undefined)}
              />
            </Group>
          );
        })}
        {activeCountry &&
          !btorsByCountry.map((d) => d.isoAlpha3).includes(activeCountry) && (
            <g>
              <text x={width / 2 - 30} y="150" fontSize="10px" fill="red">
                No Travel for {activeCountry}
              </text>
            </g>
          )}
      </g>
    </svg>
  );
};

export default BtorsByYear;
