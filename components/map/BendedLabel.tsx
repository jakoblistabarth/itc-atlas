import type { FC } from "react";
import { nanoid } from "nanoid";
import getGraticuleTextPath from "../../lib/cartographic/getGraticuleTextPath";
import type { GeoProjection } from "d3-geo";
import type { TextAppearance } from "../../types/Appearance";

type Props = React.PropsWithChildren<{
  graticuleType: "lat" | "lon";
  degree: number;
  projection: GeoProjection;
  xOffset?: number;
  yOffset?: number;
  style?: TextAppearance;
}>;

const BendedLabel: FC<Props> = ({
  graticuleType,
  degree,
  projection,
  xOffset = 0,
  yOffset = 0,
  style,
  children,
}) => {
  const path = getGraticuleTextPath(graticuleType, degree, projection);
  const id = nanoid();
  return (
    <g>
      {path && <path id={id} d={path} fill={"none"} stroke={"none"} />}
      <text
        fontSize={style?.fontSize ?? 5}
        fontFamily={style?.fontFamily}
        textAnchor={"start"}
        dx={xOffset}
        dy={yOffset}
      >
        <textPath xlinkHref={`#${id}`}>{children}</textPath>
      </text>
    </g>
  );
};

export default BendedLabel;
