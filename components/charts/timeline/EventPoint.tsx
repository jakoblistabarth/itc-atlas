import type { FC } from "react";
import type { ScaleTime } from "d3";

type Props = {
  date: Date;
  xScale: ScaleTime<number, number>;
  yOffset: number;
  title: string;
  size?: number;
  fill?: string;
  transparent?: boolean;
};

const Event: FC<Props> = ({
  date,
  xScale,
  yOffset,
  title,
  size,
  fill,
  transparent = false,
}) => {
  const displayTitle = title.length > 20 ? title.slice(0, 20) + "…" : title;
  return (
    <g transform={`translate(${xScale(date)}, ${yOffset})`}>
      <text fontSize={10} textAnchor="end" dominantBaseline="central">
        {displayTitle}
      </text>
      <circle
        r={size}
        fill={fill ?? "black"}
        fillOpacity={transparent ? 0.2 : 1}
      />
    </g>
  );
};

export default Event;
