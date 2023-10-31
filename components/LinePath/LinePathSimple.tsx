import { ScaleLinear, ascending, range } from "d3";
import { FC } from "react";
import LinePathBase, { LinePathDatum } from "./LinePathBase";

type Props = {
  mouseEnterLeaveHandler: (identifier?: string) => void;
  xScale: ScaleLinear<number | string, number, never>;
  yScale: ScaleLinear<number | string, number, never>;
  color?: string | string[];
  identifier: string;
  label?: string;
  xLabel?: string;
  yLabel?: string;
  isSelection: boolean;
  isFocus: boolean;
  isSelected: boolean;
  data: LinePathDatum[];
};

const LinePath: FC<Props> = ({
  xScale,
  yScale,
  color = "black",
  isSelected,
  isSelection,
  isFocus,
  data,
}) => {
  return (
    <g>
      {Array.isArray(color) ? (
        range(color.length).map((i) => (
          <LinePathBase
            key={i}
            data={data.sort((a, b) => ascending(a.x, b.x))}
            xScale={xScale}
            yScale={yScale}
            stroke={color[i]}
            strokeDasharray={`${5} ${5 * (color.length - 1)}`}
            strokeDashoffset={i * -5}
            isFocus={isFocus}
            isSelected={isSelected}
            isSelection={isSelection}
            cursor="pointer"
          />
        ))
      ) : (
        <LinePathBase
          data={data.sort((a, b) => ascending(a.x, b.x))}
          xScale={xScale}
          yScale={yScale}
          stroke={color}
          isFocus={isFocus}
          isSelected={isSelected}
          isSelection={isSelection}
        />
      )}
    </g>
  );
};

export default LinePath;
