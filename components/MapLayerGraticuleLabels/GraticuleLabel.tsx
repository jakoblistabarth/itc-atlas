import { FC } from "react";
import { Position } from "geojson";

type Props = React.PropsWithChildren<{
  type: "latitude" | "longitude";
  xy: Position;
  fontSize: number;
}>;

const LegendTitle: FC<Props> = ({ type, xy, fontSize, children }) => {
  const side = xy[0] >= 0 ? "end" : "start";
  const textAnchor = type == "latitude" ? side : "middle";
  const dy = type == "latitude" ? fontSize / 2 : 0;
  return (
    <text textAnchor={textAnchor} dy={dy} x={xy[0]} y={xy[1]}>
      {children}
    </text>
  );
};

export default LegendTitle;
