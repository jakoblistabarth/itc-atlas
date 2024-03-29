import { useId, type FC } from "react";
import { getGraticuleTextPath } from "./LabelArea.helpers";
import type { GeoProjection } from "d3-geo";
import type { TextAppearance } from "../../types/Appearance";
import { scaleLinear } from "d3";

type Props = React.PropsWithChildren<{
  graticuleType: "lat" | "lon";
  degree: number;
  projection: GeoProjection;
  textAnchor?: "middle" | "start" | "end";
  textOriginDegree?: number;
  xOffset?: number;
  yOffset?: number;
  style?: TextAppearance;
}>;

const LabelArea: FC<Props> = ({
  graticuleType,
  degree,
  projection,
  textOriginDegree = 0,
  textAnchor = "middle",
  xOffset = 0,
  yOffset = 0,
  style,
  children,
}) => {
  const path = getGraticuleTextPath(graticuleType, degree, projection);
  const domain = graticuleType == "lon" ? [-90, 90] : [-180, 180];
  const scaleOffset = scaleLinear().domain(domain).range([0, 100]);
  const id = useId();
  return (
    <g>
      {path && (
        <path
          id={id}
          d={path}
          fill={"none"}
          stroke={"none"}
          strokeWidth={0.5}
        />
      )}
      <text
        fontSize={style?.fontSize ?? 5}
        fontFamily={style?.fontFamily}
        textAnchor={textAnchor}
        dx={xOffset}
        dy={yOffset}
      >
        <textPath
          startOffset={`${scaleOffset(textOriginDegree)}%`}
          xlinkHref={`#${id}`}
        >
          {children}
        </textPath>
      </text>
    </g>
  );
};

export default LabelArea;
