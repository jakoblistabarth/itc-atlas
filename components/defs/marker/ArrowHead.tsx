import { FC } from "react";

const ArrowHead: FC<{ color?: string }> = ({ color }) => {
  return (
    <marker
      id="ArrowHead"
      markerWidth="8"
      markerHeight="8"
      refX="5"
      refY="4"
      orient="auto"
    >
      <path d="M 3 2 L 5 4 L 3 6" strokeWidth="1" stroke={color} fill="none" />
    </marker>
  );
};

export default ArrowHead;
