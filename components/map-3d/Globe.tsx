import { ContactShadows, useTexture } from "@react-three/drei";
import React, { FC, RefObject } from "react";
import { Vector3, FrontSide, DoubleSide } from "three";

type PropTypes = React.PropsWithChildren<{
  position?: Vector3;
  radius?: number;
  texture?: "day" | "night" | "explorer" | "grid";
  bumpScale?: number;
  displacementScale?: number;
  canvasTexture?: boolean;
  canvasRef?: RefObject<HTMLCanvasElement>;
  transparent?: boolean;
}>;

const Globe: FC<PropTypes> = ({
  position = new Vector3(0, 0, 0),
  canvasRef,
  canvasTexture = false,
  radius = 1,
  texture = "day",
  children,
  bumpScale = 0.01,
  displacementScale = 0.025,
  transparent = false,
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

  return (
    <>
      <ambientLight args={[undefined, 0.2]} />
      <directionalLight
        castShadow
        position={[10, 10, 0]}
        args={["white", 0.5]}
      />
      <mesh castShadow receiveShadow position={position}>
        <sphereGeometry args={[radius, 512, 256]} />
        <meshPhongMaterial
          displacementScale={displacementScale}
          bumpScale={bumpScale}
          {...(!canvasTexture && textureProps)}
          transparent
          side={transparent ? DoubleSide : FrontSide}
        >
          {canvasTexture && canvasRef?.current && (
            <canvasTexture
              attach={"map"}
              image={canvasRef?.current}
              anisotropy={4}
            />
          )}
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
