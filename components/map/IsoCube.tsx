import { range, scaleLinear } from "d3";
import type { Position } from "geojson";
import { FC } from "react";
import { Vector2 } from "three";
import { Appearance } from "../../types/Appearance";
import IsoUnit from "./IsoUnit";

type Props = {
  xy: Position;
  value: number;
  base: number;
  side: number;
  style?: Appearance;
  label?: boolean;
  silhouette?: boolean;
};

const IsoCube: FC<Props> = ({
  xy,
  value,
  side,
  base = 3,
  style,
  label,
  silhouette = true,
}) => {
  const unitNoScale = scaleLinear()
    .domain([0, 100])
    .range([0, Math.pow(base, 3)]);
  const unitNo = Math.ceil(unitNoScale(value));
  const unitScale = scaleLinear().domain([0, 10]).range([0, 10]);
  const l = new Vector2(0, -side);
  const r = new Vector2((-Math.sqrt(3) * side) / 2, side / 2);
  const c = new Vector2((Math.sqrt(3) * side) / 2, side / 2);
  let count = 0;
  return (
    <g transform={`translate(${xy[0]}, ${xy[1]})`}>
      <IsoUnit
        scale={unitScale}
        value={side * base}
        xy={[0, 0]}
        side={side * base}
        style={
          silhouette
            ? { strokeWidth: (style?.strokeWidth ?? 1) * 3 }
            : { strokeWidth: 2 }
        }
      />
      <g
        className="smallCubes"
        transform={`translate(0, ${(side * -base) / 2 + side / 2})`}
      >
        {range(base).map((level) =>
          range(base).map((row) =>
            range(base).map((column) => {
              const pos = new Vector2(0, 0)
                .addScaledVector(l, level)
                .addScaledVector(r, row)
                .addScaledVector(c, column);
              return (
                count++ < unitNo && (
                  <IsoUnit
                    key={`${level}-${row}-${column}`}
                    scale={unitScale}
                    value={side}
                    xy={pos.toArray()}
                    side={side}
                    style={style}
                    shadow={false}
                  />
                )
              );
            })
          )
        )}
      </g>
    </g>
  );
};

export default IsoCube;
