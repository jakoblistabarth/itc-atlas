import { FC } from "react";
import { Position } from "geojson";
import { textAppearance } from "../../types/SymbolAppearance";

type Props = React.PropsWithChildren<{
  xy: Position;
  offset?: {
    x: number;
    y: number;
  };
  style?: textAppearance & {
    fontSize: number;
  };
}>;

const PointLabel: FC<Props> = ({
  xy,
  offset = { x: 10, y: 0 },
  style = { fontSize: 10 },
  children,
}) => {
  return (
    <g
      fontSize={style.fontSize}
      transform={`translate(${xy[0] + offset.x}, ${
        xy[1] + style.fontSize * 0.5
      })`}
    >
      {children}
    </g>
  );
};

export default PointLabel;
