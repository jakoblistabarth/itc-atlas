import type { FC } from "react";
import type { ScaleTime } from "d3";

type Props = React.PropsWithChildren<{
  dateStart: Date;
  dateEnd: Date;
  xScale: ScaleTime<number, number>;
  yOffset: number;
  height: number;
  fill?: string;
}>;

const Event: FC<Props> = ({
  dateStart,
  dateEnd,
  xScale,
  height,
  yOffset,
  fill,
  children,
}) => {
  const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
  return (
    <g transform={`translate(${xScale(dateStart)}, ${yOffset})`}>
      <rect width={width} height={height} fill={fill ?? "black"} rx={2} />
      {children}
    </g>
  );
};

export default Event;
