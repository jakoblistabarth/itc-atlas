import { FC, PropsWithChildren, SVGProps } from "react";

type Props = PropsWithChildren<{
  name?: string;
  width: number;
  height: number;
  angle?: number;
  spacing?: number;
}>;

const PatternLines: FC<Props> = ({
  name = "Shape",
  height,
  width,
  angle = 0,
  spacing = 0,
  children,
}) => {
  const w = width * (1 + spacing);
  const h = height * (1 + spacing);
  return (
    <pattern
      id={name}
      width={w}
      height={h}
      patternTransform={`rotate(${angle} ${w / 2} ${h / 2})`}
      patternUnits="userSpaceOnUse"
    >
      <g transform={`translate(${w / 2} ${h / 2})`}>{children}</g>
    </pattern>
  );
};

export default PatternLines;
