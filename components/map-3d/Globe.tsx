import { FC, useLayoutEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { ContactShadows, useTexture } from "@react-three/drei";
import React from "react";
import { animated, config, useSpring } from "@react-spring/three";

type PropTypes = React.PropsWithChildren<{
  position?: Vector3;
  radius?: number;
  texture?: "day" | "night" | "explorer" | "grid";
  bumpScale?: number;
  displacementScale?: number;
  //   canvas; TODO: use canvas to display generated texture
}>;

const Globe: FC<PropTypes> = ({
  position = new Vector3(0, 0, 0),
  //   canvas,
  radius = 1,
  texture = "day",
  children,
  bumpScale = 0.01,
  displacementScale = 0.025,
}) => {
  let textureFile;
  switch (texture) {
    case "night":
      textureFile = "earth_lights_lrg.jpg";
      break;
    case "explorer":
      textureFile = "eo_base_2020_clean_3600x1800.png";
      break;
    default:
      textureFile = "land_shallow_topo_2048.jpg";
  }

  const textureProps = useTexture({
    map: "/textures/" + textureFile,
    displacementMap: "/textures/gebco_08_rev_elev_2000x1000.png",
    bumpMap: "/textures/gebco_08_rev_elev_2000x1000.png",
  });

  //   useLayoutEffect(() => {
  //     const texture = canvas;
  //     const width = 2400;
  //     const height = width / 2;
  //     texture.width = width;
  //     texture.height = height;

  //     const ctx = texture.getContext("2d");
  //     if (!ctx) return;

  //     const graticule = geoGraticule10();
  //     const projection = geoEquirectangular().fitSize([width, height], {
  //       type: "Sphere",
  //     });
  //     const path = geoPath(projection, ctx);
  //     (ctx.fillStyle = "white"), ctx.fill();
  //     ctx.fillRect(0, 0, width, height);
  //     ctx.save();
  //     ctx.beginPath(), path(graticule), (ctx.strokeStyle = "grey"), ctx.stroke();
  //     ctx.beginPath(), path(world), (ctx.strokeStyle = "black"), ctx.stroke();
  //     ctx.restore();
  //   });

  return (
    <>
      <ambientLight args={[undefined, 0.2]} />
      <directionalLight castShadow position={[10, 10, 0]} args={["white", 3]} />
      <mesh castShadow receiveShadow position={position}>
        <sphereGeometry args={[radius, 512, 256]} />
        <meshPhongMaterial
          displacementScale={displacementScale}
          bumpScale={bumpScale}
          {...textureProps}
        >
          {/* <canvasTexture ref={canvas} attach="map" image={canvas} /> */}
        </meshPhongMaterial>
      </mesh>
      {children}
      <ContactShadows
        frames={1}
        opacity={0.2}
        blur={2}
        position={[0, -1.1, 0]}
      />
    </>
  );
};

export default Globe;
