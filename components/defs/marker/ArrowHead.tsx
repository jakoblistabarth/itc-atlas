import { FC } from "react";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";

const ArrowHead: FC<{ color?: string; type?: "tip" | "triangle" }> = ({
  color = defaultTheme.flow?.stroke,
  type = defaultTheme.flow?.markerEnd,
}) => {
  let path;
  switch (type) {
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
    default:
      path = (
        <path
          d="M 4 2.5 L 6 4 L 4 5.5 Z"
          strokeWidth="0"
          stroke="none"
          fill={color}
        />
      );
  }

  return (
    <marker
      id={type}
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

export default ArrowHead;
