import { FC, useState } from "react";
import { Vector3 } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { GeoJsonProperties } from "geojson";

const Mark3dSphere: FC<{
  pos: Vector3;
  radius: number;
  data: GeoJsonProperties;
  onPointerEnterHandler: (airport: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
}> = ({ pos, radius, data, onPointerEnterHandler, onPointerLeaveHandler }) => {
  const [hover, setHover] = useState(false);

  const { scale } = useSpring({
    scale: hover ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      scale={scale}
      onPointerEnter={() => {
        setHover(true);
        onPointerEnterHandler(data);
      }}
      onPointerLeave={() => {
        setHover(false);
        onPointerLeaveHandler && onPointerLeaveHandler();
      }}
      position={pos}
      castShadow
    >
      <sphereGeometry args={[radius]} />
      <meshStandardMaterial color={hover ? "red" : "black"} />
    </animated.mesh>
  );
};

export default Mark3dSphere;
