import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { useImperativeHandle, useLayoutEffect, useRef } from "react";
import { feature } from "topojson-client";
import React from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  sphereColor?: string;
  graticuleColor?: string;
  fillColor?: string;
  strokeColor?: string;
};

const GlobeTexture = React.forwardRef<HTMLCanvasElement, Props>(
  (
    {
      neCountriesTopoJson,
      sphereColor = "white",
      graticuleColor = "grey",
      fillColor = "lightgrey",
      strokeColor = "white",
    },
    ref
  ) => {
    const world = feature(
      neCountriesTopoJson,
      neCountriesTopoJson.objects.ne_admin_0_countries
    );

    const internalRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
      ref,
      () => internalRef.current
    );

    const width = 2400;
    const height = width / 2;

    useLayoutEffect(() => {
      const ctx = internalRef?.current?.getContext("2d");
      if (!ctx) return;

      const graticule = geoGraticule10();
      const projection = geoEquirectangular().fitSize([width, height], {
        type: "Sphere",
      });
      const path = geoPath(projection, ctx);
      (ctx.fillStyle = sphereColor), ctx.fill();
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.beginPath(),
        path(graticule),
        (ctx.strokeStyle = graticuleColor),
        ctx.stroke();
      ctx.beginPath(), path(world), (ctx.fillStyle = fillColor), ctx.fill();
      (ctx.strokeStyle = strokeColor), ctx.stroke();
      ctx.restore();
    });

    return (
      <canvas
        style={{ display: "none" }}
        width={width}
        height={height}
        ref={internalRef}
      />
    );
  }
);

export default GlobeTexture;
