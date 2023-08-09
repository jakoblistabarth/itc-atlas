import { FC, SVGProps } from "react";

type Props = {
  name?: string;
  angle?: number;
  dotSize?: number;
  spacing?: number;
} & Omit<SVGProps<SVGCircleElement>, "cx" | "cy" | "r">;

const PatternDot: FC<Props> = ({
  angle = 0,
  name = "Dots",
  dotSize = 2,
  spacing = 0.25,
  ...rest
}) => {
  const strokeWidth = rest.strokeWidth
    ? parseFloat(rest.strokeWidth + "" ?? "0")
    : 0;
  const patternSize = dotSize * (1 + spacing) + strokeWidth;
  return (
    <pattern
      id={name}
      width={patternSize}
      height={patternSize}
      patternTransform={`rotate(${angle} ${patternSize / 2} ${
        patternSize / 2
      })`}
      patternUnits="userSpaceOnUse"
    >
      <circle
        cx={patternSize / 2}
        cy={patternSize / 2}
        r={dotSize * 0.5}
        {...rest}
      />
    </pattern>
  );
};

export default PatternDot;
