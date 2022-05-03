import { FC } from "react";
import { PatternAppearance } from "../../../types/Appearance";

const PatternLines: FC<{ style?: PatternAppearance; angle?: number }> = ({
  style,
  angle = 0,
}) => {
  const size = 2;
  return (
    <pattern
      id="Lines"
      width={size}
      height={size}
      patternTransform={`rotate(${
        style?.patternTransform?.angle ?? angle
      } 0 0)`}
      patternUnits="userSpaceOnUse"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={size}
        stroke={style?.color ?? "black"}
        strokeWidth="1"
      />
    </pattern>
  );
};

export default PatternLines;
