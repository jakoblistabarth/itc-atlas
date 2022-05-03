import { FC } from "react";
import { Position } from "geojson";
import { TextAppearance } from "../../types/Appearance";

type Props = React.PropsWithChildren<{
  xy: Position;
  offset?: {
    x: number;
    y: number;
  };
  style?: TextAppearance & {
    size: number;
  };
}>;

const PointLabel: FC<Props> = ({
  xy,
  offset = { x: 10, y: 0 },
  style = { size: 10 },
  children,
}) => {
  return (
    <g
      fontSize={style.size}
      transform={`translate(${xy[0] + offset.x}, ${xy[1] + style.size * 0.5})`}
    >
      {children}
    </g>
  );
};

export default PointLabel;
