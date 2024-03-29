import { FC } from "react";

export type ArrowHeadShape = "tip" | "triangle" | "tapered";

const MarkerArrowHead: FC<{ color?: string; shape?: ArrowHeadShape }> = ({
  color = "black",
  shape = "tapered",
}) => {
  let path;
  switch (shape) {
    case "tip":
      path = (
        <path
          d="M 3 2 L 5 4 L 3 6"
          strokeWidth="1"
          stroke={color}
          fill="none"
        />
      );
      break;
    case "triangle":
      path = (
        <path
          d="M 4 2.5 L 6 4 L 4 5.5 Z"
          strokeWidth="0"
          stroke="none"
          fill={color}
        />
      );
      break;
    default:
      path = (
        <path
          d="M 5 3.5 H 7 L 8 4 L 7 4.5 H 5 Z"
          strokeWidth={0}
          stroke={"none"}
          fill={color}
        />
      );
  }

  return (
    <marker
      id={shape}
      markerWidth="8"
      markerHeight="8"
      refX="5"
      refY="4"
      orient="auto"
    >
      {path}
    </marker>
  );
};

export default MarkerArrowHead;
