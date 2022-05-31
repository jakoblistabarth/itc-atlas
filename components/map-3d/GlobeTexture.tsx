import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { useImperativeHandle, useLayoutEffect, useRef } from "react";
import { Topology } from "topojson-specification";
import { feature } from "topojson-client";
import React from "react";

type Props = { countries: Topology };

const GlobeTexture = React.forwardRef<HTMLCanvasElement, Props>(
  ({ countries }, ref) => {
    const world = feature(countries, countries.objects.countries);

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
      (ctx.fillStyle = "white"), ctx.fill();
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.beginPath(),
        path(graticule),
        (ctx.strokeStyle = "grey"),
        ctx.stroke();
      ctx.beginPath(), path(world), (ctx.strokeStyle = "black"), ctx.stroke();
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
