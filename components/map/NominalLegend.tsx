import { nanoid } from "nanoid";
import { FC } from "react";
import LegendTitle from "./LegendTitle";

const NominalLegend: FC<{
  entries: { label: string; color: string }[];
  title: string;
}> = ({ entries, title }) => {
  const fontSize = 10;
  const radius = fontSize * 0.5;
  return (
    <g transform={`translate(0, 0)`}>
      <LegendTitle>{title}</LegendTitle>
      {entries.map((entry, index) => (
        <g
          key={nanoid()}
          transform={`translate(0, ${fontSize * 4 + index * fontSize * 1.75})`}
        >
          <circle
            cx={radius}
            cy={-radius * 0.75}
            r={radius}
            fill={entry.color}
          />
          <text fontSize={fontSize} x={radius * 2.5}>
            {entry.label ?? "not indicated"}
          </text>
        </g>
      ))}
    </g>
  );
};

export default NominalLegend;
