import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import type { FC } from "react";
import type { MapTheme } from "../../../types/MapTheme";
import type { ScaleTime } from "d3";

type Props = {
  dateStart: Date;
  dateEnd: Date;
  xScale: ScaleTime<number, number>;
  yOffset: number;
  height: number;
  title: string;
  fill?: string;
  theme?: MapTheme;
};

const Event: FC<Props> = ({
  dateStart,
  dateEnd,
  xScale,
  height,
  yOffset,
  title,
  fill,
  theme = defaultTheme,
}) => {
  const displayTitle = title.length > 20 ? title.slice(0, 20) + "…" : title;
  const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
  return (
    <g transform={`translate(${xScale(dateStart)}, ${yOffset})`}>
      <text fontSize={10} x={-5} textAnchor="end" dominantBaseline="central">
        {displayTitle}
      </text>
      <rect width={width} height={height} fill={fill ?? "black"} rx={2} />
    </g>
  );
};

export default Event;
