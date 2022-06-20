import { FC, useState } from "react";
import { Vector3 } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { Row } from "../../types/DataFrame";

const Point3D: FC<{
  pos: Vector3;
  radius: number;
  data: Row;
}> = ({ pos, radius, data }) => {
  const [hover, setHover] = useState(false);

  const { scale } = useSpring({
    scale: hover ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      scale={scale}
      onPointerEnter={() => setHover(!hover)}
      onPointerLeave={() => setHover(!hover)}
      onClick={() => console.log(data)}
      position={pos}
      castShadow
    >
      <sphereGeometry args={[radius]} />
      <meshStandardMaterial color={hover ? "red" : "black"} />
    </animated.mesh>
  );
};

export default Point3D;
