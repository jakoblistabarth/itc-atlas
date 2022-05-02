import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const FlowLegend: FC<{
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  style: SymbolAppearance;
}> = ({ data, scaleWidth, title, unitLabel, style }) => {
  const min = d3.min(data);
  const max = d3.max(data);
  if (!min || !max) return <g />;
  const entries = [min, max / 2, max];

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const linePath = line([
    [0, 0],
    [80, 0],
  ]);
  if (!linePath) return <></>;

  return (
    <g id="legend" transform="translate(0, 450)">
      <text fontFamily="Fraunces" fontWeight="bold">
        {title}
      </text>
      <g id="entries" transform="translate(0, 20)">
        {entries.map((entry, index) => {
          const fontSize = style.text?.size ?? 10;

          return (
            <g transform={`translate(10, ${index * 30})`}>
              <path
                d={linePath}
                stroke={style.stroke?.color ?? "black"}
                fill={style.fill?.color ?? "none"}
                opacity={style.opacity ?? "1"}
                strokeWidth={scaleWidth(entry)}
                marker-end={"url(#arrowHead)"}
              />
              <text x={100} y={fontSize / 2} fontSize={fontSize}>
                {fInt(entry) + " " + unitLabel ?? null}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default FlowLegend;
