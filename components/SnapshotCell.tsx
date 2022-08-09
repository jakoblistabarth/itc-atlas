import { forwardRef, useState } from "react";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  onMouseEnter: () => void;
};

const SnapshotCell = forwardRef<SVGRectElement, Props>(
  ({ x, y, width, height, fill, stroke, strokeWidth, onMouseEnter }, ref) => {
    const [hover, setHover] = useState(false);
    const onMouseEnterHandler = () => {
      setHover(true);
      onMouseEnter();
    };
    return (
      <rect
        ref={ref}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        strokeWidth={hover ? "1" : strokeWidth}
        stroke={hover ? "black" : stroke ?? "none"}
        onMouseEnter={() => onMouseEnterHandler()}
        onMouseLeave={() => setHover(false)} //Question: why does this work better than: setHover(!hover)
      />
    );
  }
);

export default SnapshotCell;
