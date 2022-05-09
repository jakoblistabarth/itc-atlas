import { FC } from "react";
import { Position } from "geojson";
import { TextAppearance } from "../../types/Appearance";

type Props = React.PropsWithChildren<{
  xy: Position;
  offsetX?: number;
  offsetY?: number;
  style?: TextAppearance & {
    fontSize: number;
  };
}>;

const PointLabel: FC<Props> = ({
  xy,
  offsetX = 10,
  offsetY = 0,
  style = { fontSize: 10 },
  children,
}) => {
  return (
    <g
      fontSize={style.fontSize}
      fontFamily={style.fontFamily}
      style={{
        textTransform: style.textTransform ?? "none",
        letterSpacing: style.letterSpacing,
      }}
      transform={`translate(${xy[0] + offsetX}, ${
        xy[1] - style.fontSize * 0.25 + offsetY
      })`}
    >
      {children}
    </g>
  );
};

export default PointLabel;
