import { useTexture } from "@react-three/drei";
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
    roughnessMap: "/textures/gebco_08_rev_bath_3600x1800_color.jpg",
  });

  return (
    <>
      <mesh castShadow receiveShadow position={position}>
        <sphereGeometry args={[radius, 512, 256]} />
        <meshStandardMaterial
          displacementScale={displacementScale}
          bumpScale={bumpScale}
          {...(!canvasTexture && textureProps)}
          transparent
          roughness={0.7}
          side={transparent ? DoubleSide : FrontSide}
        >
          {canvasTexture && canvasRef?.current && (
            <canvasTexture
              attach={"map"}
              image={canvasRef?.current}
              anisotropy={4}
            />
          )}
        </meshStandardMaterial>
      </mesh>
      {children}
    </>
  );
};

export default Globe;

export const FallBackGlobe: FC<{ radius: number }> = ({ radius }) => (
  <mesh castShadow receiveShadow>
    <sphereGeometry args={[radius, 64, 64]} />
    <meshStandardMaterial color="white" />
  </mesh>
);
