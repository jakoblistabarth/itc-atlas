import { FC } from "react";
import { Appearance } from "../../types/Appearance";
import type { Position } from "geojson";
import PointLabel from "./PointLabel";
import { ScaleLinear } from "d3";
import { nanoid } from "nanoid";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

const IsoUnit: FC<{
  xy: Position;
  side: number;
  value: number;
  scale: ScaleLinear<number, number>;
  style?: Appearance;
  label?: boolean;
  shadow?: boolean;
}> = ({ xy, side, value, scale, style, label = false, shadow = true }) => {
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

  const faces = [topFace, rightFacePath, leftFacePath];
  // const faces = [rightFacePath, leftFacePath, topFace];
  return (
    <g transform={`translate(${xy[0]} ${xy[1]} )`}>
      {shadow && (
        <path
          d={shade}
          transform={`rotate(30)`}
          fill={style?.stroke ?? defaultTheme.symbol?.fill}
          strokeLinejoin={"round"}
          strokeWidth={style?.strokeWidth ?? defaultTheme.symbol?.strokeWidth}
          stroke={style?.stroke ?? defaultTheme.symbol?.stroke}
          opacity={0.1}
        />
      )}
      {faces.map((face) => (
        <path
          key={nanoid()}
          transform={`translate(0, ${-height + side / 2})`}
          d={face}
          fill={style?.fill ?? defaultTheme.symbol?.fill}
          fillOpacity={
            style?.fillOpacity ??
            style?.stroke ??
            defaultTheme.symbol?.fillOpacity
          }
          stroke={style?.stroke ?? defaultTheme.symbol?.stroke}
          strokeWidth={style?.strokeWidth ?? defaultTheme.symbol?.strokeWidth}
          strokeLinejoin={"round"}
        />
      ))}
      {label && (
        <PointLabel xy={[0, 0]} offsetX={0} offsetY={15 + side / 2}>
          <text textAnchor="middle" fontWeight={"bold"}>
            {value}
          </text>
        </PointLabel>
      )}
    </g>
  );
};

export default IsoUnit;
