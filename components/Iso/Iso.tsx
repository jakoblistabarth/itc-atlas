import { FC, SVGProps } from "react";
import { Appearance } from "../../types/Appearance";
import LabelPoint from "../LabelPoint";
import { ScaleLinear } from "d3";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Vector2 } from "three";
import { LabelPlacement } from "../../types/LabelPlacement";

type Props = {
  side: number;
  value: number;
  scaleHeight: ScaleLinear<number, number>;
  style?: Appearance;
  label?: boolean;
  shadow?: boolean;
} & SVGProps<SVGSVGElement>;

const MarkIso: FC<Props> = ({
  side,
  value,
  scaleHeight,
  style,
  label = false,
  shadow = true,
  ...rest
}) => {
  const height = scaleHeight(value);
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
  return (
    <g {...rest}>
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
          key={face}
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
        <LabelPoint
          position={new Vector2(0, 15 + side / 2)}
          placement={LabelPlacement.CENTER}
        >
          {value}
        </LabelPoint>
      )}
    </g>
  );
};

export default MarkIso;
