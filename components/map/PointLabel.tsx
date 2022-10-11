import type { FC } from "react";
import type { TextAppearance } from "../../types/Appearance";
import { LabelPlacement } from "../../types/LabelPlacement";
import { Vector2 } from "three";

type Props = React.PropsWithChildren<{
  position?: Vector2;
  placement?: LabelPlacement;
  style?: TextAppearance & {
    fontSize: number;
  };
}>;

const PointLabel: FC<Props> = ({
  position = new Vector2(0, 0),
  placement = LabelPlacement.TOPRIGHT,
  style = { fontSize: 10 },
  children,
}) => {
  const dx =
    placement === LabelPlacement.TOPRIGHT ||
    placement === LabelPlacement.BOTTOMRIGHT ||
    placement === LabelPlacement.RIGHT
      ? style.fontSize * 0.5
      : placement === LabelPlacement.BOTTOMLEFT ||
        placement === LabelPlacement.TOPLEFT ||
        placement === LabelPlacement.LEFT
      ? style.fontSize * -0.5
      : 0;
  const dy =
    placement === LabelPlacement.TOP
      ? style.fontSize * -1
      : placement === LabelPlacement.TOPLEFT ||
        placement === LabelPlacement.TOPRIGHT
      ? style.fontSize * -0.5
      : placement === LabelPlacement.BOTTOMRIGHT ||
        placement === LabelPlacement.BOTTOMLEFT
      ? style.fontSize * 1.5
      : placement === LabelPlacement.BOTTOM
      ? style.fontSize * 2
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
      fontSize={style.fontSize}
      fontFamily={style.fontFamily}
      style={{
        textTransform: style.textTransform ?? "none",
        letterSpacing: style.letterSpacing,
      }}
      transform={`translate(${position.x}, ${position.y})`}
    >
      <text
        dx={dx}
        dy={dy}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
      >
        {children}
      </text>
    </g>
  );
};

export default PointLabel;
