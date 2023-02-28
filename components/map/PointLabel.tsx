import type { FC, SVGProps } from "react";
import { LabelPlacement } from "../../types/LabelPlacement";
import { Vector2 } from "three";
import toInt from "../../lib/utilities/toInt";

type Props = React.PropsWithChildren<
  SVGProps<SVGTextElement> & {
    position?: Vector2;
    placement?: LabelPlacement;
  }
>;

const PointLabel: FC<Props> = ({
  position = new Vector2(0, 0),
  placement = LabelPlacement.TOPRIGHT,
  children,
  fontSize = 6,
  ...props
}) => {
  const dx =
    placement === LabelPlacement.TOPRIGHT ||
    placement === LabelPlacement.BOTTOMRIGHT ||
    placement === LabelPlacement.RIGHT
      ? (toInt(fontSize) ?? 6) * 0.5
      : placement === LabelPlacement.BOTTOMLEFT ||
        placement === LabelPlacement.TOPLEFT ||
        placement === LabelPlacement.LEFT
      ? (toInt(fontSize) ?? 6) * -0.5
      : 0;
  const dy =
    placement === LabelPlacement.TOP
      ? (toInt(fontSize) ?? 6) * -0.75
      : placement === LabelPlacement.TOPLEFT ||
        placement === LabelPlacement.TOPRIGHT
      ? (toInt(fontSize) ?? 6) * -0.5
      : placement === LabelPlacement.BOTTOMRIGHT ||
        placement === LabelPlacement.BOTTOMLEFT
      ? (toInt(fontSize) ?? 6) * 1.5
      : placement === LabelPlacement.BOTTOM
      ? (toInt(fontSize) ?? 6) * 1.75
      : 0;
  const textAnchor =
    placement === LabelPlacement.TOP ||
    placement === LabelPlacement.BOTTOM ||
    placement === LabelPlacement.CENTER
      ? "middle"
      : placement === LabelPlacement.TOPLEFT ||
        placement === LabelPlacement.BOTTOMLEFT ||
        placement === LabelPlacement.LEFT
      ? "end"
      : "start";
  const dominantBaseline =
    placement === LabelPlacement.CENTER ||
    placement === LabelPlacement.LEFT ||
    placement === LabelPlacement.RIGHT
      ? "middle"
      : "auto";
  return (
    <g
      fontSize={fontSize}
      fontFamily={props.fontFamily}
      transform={`translate(${position.x}, ${position.y})`}
    >
      <text
        {...props}
        dx={dx}
        dy={dy}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        paintOrder={"stroke fill"}
        strokeLinejoin={"round"}
      >
        {children}
      </text>
    </g>
  );
};

export default PointLabel;
