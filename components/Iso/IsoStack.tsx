import { FC } from "react";
import { Appearance } from "../../types/Appearance";
import type { Position } from "geojson";
import Iso from "./Iso";
import { range, scaleLinear } from "d3";

type Props = {
  xy: Position;
  value: number;
  maxUnits: number;
  side: number;
  style?: Appearance;
};

const IsoStack: FC<Props> = ({ xy, value, side, maxUnits, style }) => {
  const unitNoScale = scaleLinear().domain([0, 100]).range([0, maxUnits]);
  const unitNo = Math.ceil(unitNoScale(value));
  const unitScale = scaleLinear().domain([0, 10]).range([0, 10]);
  return (
    <g transform={`translate(${xy[0]}, ${xy[1]})`}>
      <Iso
        scaleHeight={unitScale}
        value={side * unitNo}
        side={side}
        style={{ strokeWidth: 2 }}
      />
      {range(0, -unitNo, -1).map((no) => {
        return (
          <Iso
            key={no}
            scaleHeight={unitScale}
            value={side}
            transform={`translate(0 ${side * no})`}
            side={side}
            style={style}
            shadow={false}
          />
        );
      })}
    </g>
  );
};

export default IsoStack;
