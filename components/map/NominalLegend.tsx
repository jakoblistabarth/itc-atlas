import { nanoid } from "nanoid";
import { FC } from "react";

const NominalLegend: FC<{
  entries: { label: string; color: string }[];
}> = ({ entries }) => {
  const fontSize = 10;
  const radius = fontSize * 0.75;
  return (
    <g transform={`translate(0, 400)`}>
      {entries.map((entry, index) => (
        <g key={nanoid()} transform={`translate(0, ${index * fontSize * 2})`}>
          <circle
            cx={radius}
            cy={-radius * 0.5}
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
