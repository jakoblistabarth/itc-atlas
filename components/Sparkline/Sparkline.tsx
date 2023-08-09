import useMeasure from "react-use-measure";
import LinePath from "../LinePath";
import { ScaleLinear } from "d3";
import { FC, useState } from "react";
import { LinePathDatum } from "../LinePath/LinePathBase";

type Props = {
  data: LinePathDatum[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  label: string;
};

const Sparkline: FC<Props> = ({ yScale, xScale, data, label }) => {
  const [ref, { width }] = useMeasure();
  const [isSelected, setIsSelected] = useState(false);

  const margin = 20;
  const height = yScale.range()[0] + margin;
  return (
    <svg
      ref={ref}
      width={"100%"}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="turquoise" />
          <stop offset="95%" stopColor="teal" />
        </linearGradient>
      </defs>
      <line
        x1={xScale.range()[0]}
        x2={xScale.range()[1]}
        strokeWidth={1}
        transform={`translate(0 ${yScale.range()[0]})`}
        stroke="lightgrey"
      />
      <LinePath
        data={data}
        xScale={xScale}
        yScale={yScale}
        identifier={label}
        mouseEnterLeaveHandler={() => {
          return;
        }}
        isSelected={isSelected}
        isSelection={false}
        isFocus={true}
        color={"url('#myGradient')"}
      />
      {xScale.domain().map((d, i) => {
        return (
          <g transform={`translate(${xScale(d)} ${height - margin})`} key={d}>
            <line y1={2} y2={5} stroke="darkgrey" />
            <text
              fontSize={10}
              textAnchor={i === 0 ? "start" : "end"}
              dy={10}
              dominantBaseline={"hanging"}
            >
              {d}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Sparkline;
