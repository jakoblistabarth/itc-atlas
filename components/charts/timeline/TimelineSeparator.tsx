import { FC } from "react";

type Props = {
  width: number;
  strokeWidth: number;
  color?: string;
  y?: number;
};

const TimelineSeparator: FC<Props> = ({
  width,
  strokeWidth,
  color = "white",
  y = 0,
}) => {
  return (
    <line
      x2={width}
      y1={y}
      y2={y}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
};

export default TimelineSeparator;
