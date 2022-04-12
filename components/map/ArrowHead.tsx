import { FC } from "react";

const ArrowHead: FC<{ id: string; color: string }> = ({ id, color }) => {
  return (
    <marker
      id={id}
      markerWidth="8"
      markerHeight="8"
      refX="5"
      refY="4"
      orient="auto"
    >
      <path d="M 3 2 L 5 4 L 3 6" stroke-width="1" stroke={color} fill="none" />
    </marker>
  );
};

export default ArrowHead;
