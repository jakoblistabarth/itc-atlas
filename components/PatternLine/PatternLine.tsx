import { FC, SVGProps } from "react";

type Props = {
  name?: string;
  strokeWidth?: number;
  angle?: number;
  spacing?: number;
} & Omit<SVGProps<SVGLineElement>, "x1" | "x2" | "y1" | "y2">;

const PatternLine: FC<Props> = ({
  name = "Lines",
  angle = 0,
  spacing = 1,
  strokeWidth = 1,
  ...rest
}) => {
  const size = strokeWidth + strokeWidth * spacing;
  return (
    <pattern
      id={name}
      width={size}
      height={size}
      patternTransform={`rotate(${angle} ${size / 2} ${size / 2})`}
      patternUnits="userSpaceOnUse"
    >
      <line
        x1={size / 2}
        y1="0"
        x2={size / 2}
        y2={size}
        strokeWidth={strokeWidth}
        {...rest}
      />
    </pattern>
  );
};

export default PatternLine;
