import type { FC, SVGProps } from "react";
import type { ScaleTime } from "d3";

type Props = React.PropsWithChildren<{
  dateStart: Date;
  dateEnd: Date;
  xScale: ScaleTime<number, number>;
  height: number;
  yOffset: number;
}> &
  Omit<SVGProps<SVGRectElement>, "width" | "x" | "y">;

const Event: FC<Props> = ({
  dateStart,
  dateEnd,
  xScale,
  yOffset,
  children,
  height = 1,
  ...rest
}) => {
  const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
  return (
    <g transform={`translate(${xScale(dateStart)}, ${yOffset})`}>
      <rect
        transform={`translate(0 ${height / -2})`}
        width={width}
        height={height}
        {...rest}
      />
      {children}
    </g>
  );
};

export default Event;
