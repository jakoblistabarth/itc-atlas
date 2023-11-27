import { FC, useState } from "react";
import { Vector3 } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { GeoJsonProperties } from "geojson";
import { useCursor } from "@react-three/drei";

const Mark3dSphere: FC<{
  pos: Vector3;
  radius: number;
  data: GeoJsonProperties;
  onPointerEnterHandler?: (info: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
}> = ({ pos, radius, data, onPointerEnterHandler, onPointerLeaveHandler }) => {
  const [hover, setHover] = useState(false);
  useCursor(hover);

  const { scale } = useSpring({
    scale: hover ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      scale={scale}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHover(true);
        onPointerEnterHandler && onPointerEnterHandler(data);
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
