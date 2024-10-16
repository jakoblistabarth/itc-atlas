import type { FC, SVGProps } from "react";
import { useTimelineContext } from "./TimelineContext";

type Props = React.PropsWithChildren<{
  dateStart: Date;
  dateEnd: Date;
  height: number;
  yOffset: number;
  label?: string;
  onPointerEnterHandler?: (properties: string) => void;
  onPointerLeaveHandler?: () => void;
}> &
  Omit<SVGProps<SVGRectElement>, "width" | "x" | "y">;

const Event: FC<Props> = ({
  dateStart,
  dateEnd,
  yOffset,
  children,
  height = 1,
  label,
  onPointerEnterHandler,
  onPointerLeaveHandler,
  ...rest
}) => {
  const { xScale } = useTimelineContext();
  const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
  return (
    <g transform={`translate(${xScale(dateStart)}, ${yOffset})`}>
      <rect
        transform={`translate(0 ${height / -2})`}
        width={width}
        height={height}
        onPointerEnter={() =>
          label && onPointerEnterHandler && onPointerEnterHandler(label)
        }
        onPointerLeave={onPointerLeaveHandler}
        {...rest}
      />
      {children}
    </g>
  );
};

export default Event;
