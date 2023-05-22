import type { FC, SVGProps } from "react";
import { LinePath } from "@visx/shape";
import { max, scaleLinear } from "d3";

type Props = {
  /** Where (within the parent element) should the timeline be positioned? */
  data: any;
  width: number;
  height: number;
} & SVGProps<SVGSVGElement>;

/**
 * A wrapper components for a horizontal timeline off given dimensions.
 * @returns An svg group element, containing the timeline.
 */
const LineChart: FC<Props> = ({ data, width, height, ...rest }) => {
  const m = 5;
  const getX = (d: any): number => d.x;
  const getY = (d: any): number => d.y;
  const xScale = scaleLinear<number, number>()
    .domain([1950, new Date("2023").getFullYear()])
    .range([0, width]);
  const yScale = scaleLinear<number, number>()
    .domain([0, max(data, getY) ?? 1])
    .range([height - m - 1, m]);
  return (
    <svg width={width} height={height} {...rest}>
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="turquoise" />
          <stop offset="95%" stopColor="teal" />
        </linearGradient>
      </defs>
      <g transform={`translate(0,${m})`}>
        <LinePath<typeof data>
          data={data}
          x={(d) => xScale(getX(d))}
          y={(d) => yScale(getY(d))}
          stroke={"url('#myGradient')"}
          strokeWidth={1}
          strokeLinejoin={"round"}
          fill={"none"}
        />
      </g>
    </svg>
  );
};

export default LineChart;
