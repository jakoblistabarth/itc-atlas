import type { GeoProjection } from "d3";
import { FC } from "react";
import type { TextAppearance } from "../../types/Appearance";
import * as d3 from "d3";
import GraticuleLabel from "./GraticuleLabel";
import { GraticuleLabelOptions } from "../../types/GraticuleLableOptions";
import { nanoid } from "nanoid";

const GraticuleLabelLayer: FC<{
  projection: GeoProjection;
  style?: TextAppearance;
  lonRange: GraticuleLabelOptions;
  latRange: GraticuleLabelOptions;
}> = ({ projection, style, lonRange, latRange }) => {
  const longitudes = d3.range(lonRange.min, lonRange.max + 1, lonRange.step);
  const latitudes = d3.range(latRange.min, latRange.max + 1, latRange.step);
  return (
    <g
      id="graticuleLabelLayer"
      fontSize={style?.fontSize ?? 5}
      fontFamily={style?.fontFamily}
      fontStyle={style?.fontStyle}
      fontWeight={style?.fontWeight}
    >
      {longitudes.map((lon) => {
        const xyTop = projection([lon, 80]);
        const xyBottom = projection([lon, -80]);
        if (!xyTop || !xyBottom) return <></>;
        return (
          lon > -180 && (
            <>
              <GraticuleLabel
                key={nanoid()}
                type="longitude"
                xy={xyTop}
                fontSize={style?.fontSize ?? 10}
              >
                {lon}°
              </GraticuleLabel>
              <GraticuleLabel
                key={nanoid()}
                type="longitude"
                xy={xyBottom}
                fontSize={style?.fontSize ?? 10}
              >
                {lon}°
              </GraticuleLabel>
            </>
          )
        );
      })}
      {latitudes.map((lat) => {
        const xyLeft = projection([-160, lat]);
        const xyRight = projection([-170, lat]);
        if (!xyLeft || !xyRight) return <></>;
        return (
          <>
            <GraticuleLabel
              key={nanoid()}
              type="latitude"
              xy={xyLeft}
              fontSize={style?.fontSize ?? 10}
            >
              {lat}°
            </GraticuleLabel>
            <GraticuleLabel
              key={nanoid()}
              type="latitude"
              xy={xyRight}
              fontSize={style?.fontSize ?? 10}
            >
              {lat}°
            </GraticuleLabel>
          </>
        );
      })}
    </g>
  );
};

export default GraticuleLabelLayer;
