import type { GeoProjection } from "d3";
import { FC, SVGProps } from "react";
import type { TextAppearance } from "../../types/Appearance";
import * as d3 from "d3";
import GraticuleLabel from "./GraticuleLabel";
import { GraticuleLabelOptions } from "../../types/GraticuleLableOptions";

type Props = {
  projection: GeoProjection;
  style?: TextAppearance;
  lonRange: GraticuleLabelOptions;
  latRange: GraticuleLabelOptions;
} & SVGProps<SVGGElement>;

const GraticuleLabelLayer: FC<Props> = ({
  projection,
  style,
  lonRange,
  latRange,
  ...rest
}) => {
  const longitudes = d3.range(lonRange.min, lonRange.max + 1, lonRange.step);
  const latitudes = d3.range(latRange.min, latRange.max + 1, latRange.step);
  return (
    <g
      id="graticuleLabelLayer"
      fontSize={style?.fontSize ?? 5}
      fontFamily={style?.fontFamily}
      fontStyle={style?.fontStyle}
      fontWeight={style?.fontWeight}
      {...rest}
    >
      {longitudes.map((lon) => {
        const xyTop = projection([lon, 80]);
        const xyBottom = projection([lon, -80]);
        if (!xyTop || !xyBottom) return <></>;
        return (
          lon > -180 && (
            <g key={lon}>
              <GraticuleLabel
                type="longitude"
                xy={xyTop}
                fontSize={style?.fontSize ?? 10}
              >
                {lon}°
              </GraticuleLabel>
              <GraticuleLabel
                type="longitude"
                xy={xyBottom}
                fontSize={style?.fontSize ?? 10}
              >
                {lon}°
              </GraticuleLabel>
            </g>
          )
        );
      })}
      {latitudes.map((lat) => {
        const xyLeft = projection([-160, lat]);
        const xyRight = projection([-170, lat]);
        if (!xyLeft || !xyRight) return <></>;
        return (
          <g key={lat}>
            <GraticuleLabel
              type="latitude"
              xy={xyLeft}
              fontSize={style?.fontSize ?? 10}
            >
              {lat}°
            </GraticuleLabel>
            <GraticuleLabel
              type="latitude"
              xy={xyRight}
              fontSize={style?.fontSize ?? 10}
            >
              {lat}°
            </GraticuleLabel>
          </g>
        );
      })}
    </g>
  );
};

export default GraticuleLabelLayer;
