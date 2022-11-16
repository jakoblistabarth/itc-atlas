import type { FC } from "react";
import type { ScaleTime } from "d3";
import { nanoid } from "nanoid";

type Props = React.PropsWithChildren<{
  dateStart: Date;
  dateEnd: Date;
  xScale: ScaleTime<number, number>;
  yOffset: number;
  height: number;
  fill?: string;
  roundedCorners?: boolean;
}>;

const Event: FC<Props> = ({
  dateStart,
  dateEnd,
  xScale,
  height,
  yOffset,
  fill,
  roundedCorners = true,
  children,
}) => {
  const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
  return (
    <g key={nanoid()} transform={`translate(${xScale(dateStart)}, ${yOffset})`}>
      <rect
        width={width}
        height={height}
        fill={fill ?? "black"}
        rx={roundedCorners ? 1 : 0}
      />
      {children}
    </g>
  );
};

export default Event;
