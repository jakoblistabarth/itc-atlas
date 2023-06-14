import { useId, type FC } from "react";
import getGraticuleTextPath from "../../lib/cartographic/getGraticuleTextPath";
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

const BendedLabel: FC<Props> = ({
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
  const textOrigin =
    graticuleType === "lat"
      ? [textOriginDegree, degree]
      : [degree, textOriginDegree];
  const domain = graticuleType == "lon" ? [-90, 90] : [-180, 180];
  const scaleOffset = scaleLinear().domain(domain).range([0, 100]);
  const id = useId();
  return (
    <g>
      {/* {[1, 20].map((r, i) => (
        <circle
          cx={projection(textOrigin)[0]}
          cy={projection(textOrigin)[1]}
          r={20}
          stroke={"red"}
          fill={"white"}
        />
      ))} */}
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
          // side={degree < 0 && graticuleType === "lon" ? "right" : "left"}
          xlinkHref={`#${id}`}
        >
          {children}
        </textPath>
      </text>
    </g>
  );
};

export default BendedLabel;
