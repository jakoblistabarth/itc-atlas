import { FC, useState } from "react";
import { Vector3 } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { GeoJsonProperties } from "geojson";

const Mark3dSphere: FC<{
  pos: Vector3;
  radius: number;
  data: GeoJsonProperties;
}> = ({ pos, radius, data }) => {
  const [hover, setHover] = useState(false);

  const { scale } = useSpring({
    scale: hover ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      scale={scale}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={() => console.log(data)}
      position={pos}
      castShadow
    >
      <sphereGeometry args={[radius]} />
      <meshStandardMaterial color={hover ? "red" : "black"} />
    </animated.mesh>
  );
};

export default Mark3dSphere;
