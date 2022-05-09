import { FC } from "react";
import { PatternAppearance } from "../../../types/Appearance";

const PatternDots: FC<{ style?: PatternAppearance; angle?: number }> = ({
  style,
  angle = 0,
}) => {
  const size = 2;
  return (
    <pattern
      id="Dots"
      width={size}
      height={size}
      patternTransform={`rotate(${
        style?.patternTransform?.angle ?? angle
      } 0 0)`}
      patternUnits="userSpaceOnUse"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size * 0.3}
        fill={style?.color ?? "black"}
        stroke="none"
      />
    </pattern>
  );
};

export default PatternDots;
