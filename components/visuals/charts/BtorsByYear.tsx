/** @jsxImportSource theme-ui */

import { FC } from "react";
import useMeasure from "react-use-measure";
import { ascending, format, groups, max, min, scaleLinear } from "d3";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import AxisX from "../../charts/Axis/AxisX";
import AxisY from "../../charts/Axis/AxisY";
import RuleY from "../../charts/RuleY";
import { MdArrowUpward } from "react-icons/md";

type Props = {
  btors: BtorsGroupedByYear;
};

const BtorsByYear: FC<Props> = ({ btors }) => {
  const [chartRef, { width }] = useMeasure();

  const chartHeight = 300;
  const margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 20,
  };

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
      <RuleY xScale={xScale} yScale={yScale} />
      <AxisX
        top={chartHeight - margin.bottom + 5}
        tickFormat={format("4")}
        xScale={xScale}
      />
      <AxisY left={margin.left} yScale={yScale} />
      {btorsByCountry.map((d) => {
        return (
          <Group key={d.isoAlpha3}>
            <LinePath
              data={d.data.sort((a, b) => ascending(a.year, b.year))}
              x={(d) => xScale(d.year)}
              y={(d) => yScale(d.count)}
              strokeLinejoin="round"
              strokeWidth="1"
              stroke="black"
              opacity={0.3}
            />
          </Group>
        );
      })}
    </svg>
  );
};

export default BtorsByYear;
