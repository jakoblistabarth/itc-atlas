import { FC } from "react";
import { Appearance } from "../../types/Appearance";
import type { Position } from "geojson";
import PointLabel from "./PointLabel";
import IsoUnit from "./IsoUnit";
import { range, scaleQuantize, scaleLinear, scaleThreshold } from "d3";
import { nanoid } from "nanoid";

type Props = {
  xy: Position;
  value: number;
  maxUnits: number;
  side: number;
  style?: Appearance;
  label?: boolean;
};

const IsoStack: FC<Props> = ({ xy, value, side, maxUnits, style, label }) => {
  const unitNoScale = scaleLinear().domain([0, 100]).range([0, maxUnits]);
  const unitNo = Math.ceil(unitNoScale(value));
  const unitScale = scaleLinear().domain([0, 10]).range([0, 10]);
  return (
    <g transform={`translate(${xy[0]}, ${xy[1]})`}>
      <IsoUnit
        scale={unitScale}
        value={side * unitNo}
        xy={[0, 0]}
        side={side}
        style={{ strokeWidth: 2 }}
      />
      {range(0, -unitNo, -1).map((no) => {
        return (
          <IsoUnit
            key={nanoid()}
            scale={unitScale}
            value={side}
            xy={[0, side * no]}
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
