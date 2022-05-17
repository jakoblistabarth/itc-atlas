import { FC } from "react";
import { Appearance } from "../../types/Appearance";
import type { Position } from "geojson";
import PointLabel from "./PointLabel";
import { ScaleLinear } from "d3";
import { nanoid } from "nanoid";

const IsoBox: FC<{
  xy: Position;
  side: number;
  value: number;
  scale: ScaleLinear<number, number>;
  style?: Appearance;
  label?: boolean;
}> = ({ xy, side, value, scale, style, label = false }) => {
  const height = scale(value);
  const halfWidth = (side * Math.sqrt(3)) / 2;
  const rightFacePath = `
    M 0 0 
    l ${halfWidth} ${side / -2}
    l 0 ${height} 
    l ${-halfWidth} ${side / 2}
    l 0 ${-height}
  `;
  const leftFacePath = `
    M 0 0 
    l ${-halfWidth} ${side / -2}
    l 0 ${height} 
    l ${halfWidth} ${side / 2}
    l 0 ${-height}
  `;
  const topFace = `
    M 0 0 
    l ${halfWidth} ${side / -2}
    l ${-halfWidth} ${side / -2} 
    l ${-halfWidth} ${side / 2}
    l ${halfWidth} ${side / 2}
  `;
  const shade = `
    M 0 0
    l  0 ${side / 2} 
    l ${halfWidth + height} 0
    l ${side / 1.5} ${-side}
    l ${-halfWidth - height - side / 1.5} 0
  `;

  const faces = [rightFacePath, leftFacePath, topFace];
  return (
    <g transform={`translate(${xy[0]} ${xy[1]} )`}>
      <path
        d={shade}
        transform={`rotate(30)`}
        fill={"black"}
        strokeLinejoin={"round"}
        stroke={"black"}
        opacity={0.1}
      />
      {faces.map((face) => (
        <path
          key={nanoid()}
          transform={`translate(0, ${-height + side / 2})`}
          d={face}
          fill={style?.fill ?? "none"}
          stroke={style?.stroke}
          strokeWidth={style?.strokeWidth}
          strokeLinejoin={"round"}
        />
      ))}
      {label && (
        <PointLabel xy={[0, 0]} offsetX={0} offsetY={20}>
          <text textAnchor="middle" fontWeight={"bold"}>
            {value}
          </text>
        </PointLabel>
      )}
    </g>
  );
};

export default IsoBox;
