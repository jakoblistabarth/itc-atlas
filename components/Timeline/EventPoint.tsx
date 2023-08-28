import type { FC, SVGProps } from "react";
import { useTimelineContext } from "./TimelineContext";

type Props = React.PropsWithChildren<
  {
    date: Date;
    y?: number;
    radius: number;
    drawCenter: boolean;
  } & Omit<SVGProps<SVGCircleElement>, "cx" | "cy" | "r">
>;

const EventPoint: FC<Props> = ({
  date,
  y = 0,
  radius = 2.5,
  children,
  drawCenter = false,
  ...rest
}) => {
  const { xScale } = useTimelineContext();
  return (
    <g transform={`translate(${xScale(date)}, ${y})`}>
      <circle r={radius} {...rest} />
      {drawCenter && <circle r={0.5} {...rest} />}
      {children}
    </g>
  );
};

export default EventPoint;
