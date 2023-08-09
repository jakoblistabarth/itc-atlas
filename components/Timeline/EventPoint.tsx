import { ScaleTime } from "d3";
import type { FC, SVGProps } from "react";

type Props = React.PropsWithChildren<
  {
    date: Date;
    xScale: ScaleTime<number, number>;
    y?: number;
    radius: number;
    drawCenter: boolean;
  } & Omit<SVGProps<SVGCircleElement>, "cx" | "cy" | "r">
>;

const EventPoint: FC<Props> = ({
  date,
  xScale,
  y = 0,
  radius = 2.5,
  children,
  drawCenter = false,
  ...rest
}) => {
  return (
    <g transform={`translate(${xScale(date)}, ${y})`}>
      <circle r={radius} {...rest} />
      {drawCenter && <circle r={0.5} {...rest} />}
      {children}
    </g>
  );
};

export default EventPoint;
