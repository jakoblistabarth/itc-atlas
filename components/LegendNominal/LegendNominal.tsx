import { FC, ReactNode, SVGProps } from "react";
import sliceIntoChunks from "../../lib/utilities/sliceIntoChunks";
import LegendTitle from "../LegendTitle";

type Props = {
  entries: { label: string; color: string; symbol?: ReactNode }[];
  title?: string;
  columns?: number;
  columnWidth?: number;
  fontSize?: number;
} & SVGProps<SVGGElement>;

const LegendNominal: FC<Props> = ({
  entries,
  title,
  columns = 1,
  columnWidth = 100,
  fontSize = 6,
  ...rest
}) => {
  const symbolSize = fontSize * 1.2;
  const radius = symbolSize / 2;
  const columnLength = Math.ceil(entries.length / columns);
  const entriesByColumn = sliceIntoChunks(entries, columnLength);
  return (
    <g {...rest}>
      {title && <LegendTitle fontSize={fontSize}>{title}</LegendTitle>}
      {entriesByColumn.map((column, idx) => (
        <g key={idx} transform={`translate(${idx * columnWidth} 0)`}>
          {column.map((entry, idx) => (
            <g
              key={`${entry.label}-${idx}`}
              transform={`translate(0, ${
                (title ? fontSize * 3 : 0) + idx * fontSize * 1.75
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
    </g>
  );
};

export default LegendNominal;
