import { FC } from "react";
import { nanoid } from "nanoid";
import getGraticuleTextPath from "../../lib/cartographic/getGraticuleTextPath";
import { GeoProjection } from "d3-geo";
import { TextAppearance } from "../../types/Appearance";
import { style } from "d3";

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
      <path id={id} d={path} fill={"none"} stroke={"none"} />
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
