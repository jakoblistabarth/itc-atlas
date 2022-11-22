import { FC, PropsWithChildren, SVGProps } from "react";

type Props = PropsWithChildren<{
  name?: string;
  size: number;
  angle?: number;
  spacing?: number;
}>;

const PatternLines: FC<Props> = ({
  name = "Shape",
  size,
  angle = 0,
  spacing = 0,
  children,
}) => {
  const spacedSize = size * (1 + spacing);
  return (
    <pattern
      id={name}
      width={spacedSize}
      height={spacedSize}
      patternTransform={`rotate(${angle} ${spacedSize / 2} ${spacedSize / 2})`}
      patternUnits="userSpaceOnUse"
    >
      <g transform={`translate(${spacedSize / 2} ${spacedSize / 2})`}>
        {children}
      </g>
    </pattern>
  );
};

export default PatternLines;
