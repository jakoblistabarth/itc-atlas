import { FC, useState } from "react";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
};

const SnapshotCell: FC<Props> = ({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
}) => {
  const [hover, setHover] = useState(false);
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      strokeWidth={hover ? "1" : strokeWidth}
      stroke={hover ? "black" : stroke ?? "none"}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default SnapshotCell;
