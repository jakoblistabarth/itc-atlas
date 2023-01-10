import { nanoid } from "nanoid";
import { FC } from "react";
import sliceIntoChunks from "../../lib/utilities/sliceIntoChunks";
import LegendTitle from "./LegendTitle";

const NominalLegend: FC<{
  entries: { label: string; color: string; symbol?: SVGElement }[];
  title?: string;
  columns?: number;
  columnWidth?: number;
}> = ({ entries, title, columns = 1, columnWidth = 100 }) => {
  const fontSize = 6;
  const symbolSize = fontSize * 1.2;
  const radius = symbolSize / 2;
  const columnLength = Math.ceil(entries.length / columns);
  const entriesByColumn = sliceIntoChunks(entries, columnLength);
  return (
    <>
      {title && <LegendTitle>{title}</LegendTitle>}
      {entriesByColumn.map((column, idx) => (
        <g key={nanoid()} transform={`translate(${idx * columnWidth} 0)`}>
          {column.map((entry, index) => (
            <g
              key={nanoid()}
              transform={`translate(0, ${
                (title ? fontSize * 4 : 0) + index * fontSize * 1.75
              })`}
            >
              <g transform={`translate(${symbolSize / 2} 0)`}>
                {entry.symbol ? (
                  entry.symbol
                ) : (
                  <circle r={radius} fill={entry.color} />
                )}
              </g>
              <text
                dominantBaseline={"middle"}
                fontSize={fontSize}
                x={symbolSize + fontSize / 2}
              >
                {entry.label ?? "not indicated"}
              </text>
            </g>
          ))}
        </g>
      ))}
    </>
  );
};

export default NominalLegend;
