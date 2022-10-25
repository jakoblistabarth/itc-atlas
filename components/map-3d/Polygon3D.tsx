import { FC, useEffect, useState } from "react";
import { Color, DoubleSide, Shape } from "three";

const Polygon3D: FC<{
  shape: Shape;
  color: Color;
  fillOpacity: number;
}> = ({ shape, color, fillOpacity }) => {
  const [hover, setHover] = useState(false);

  useEffect(
    () => void (document.body.style.cursor = hover ? `pointer` : `auto`),
    [hover]
  );

  return (
    <mesh
      onPointerOver={(e) => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <shapeBufferGeometry args={[shape]} />
      <meshBasicMaterial
        color={hover ? "grey" : color}
        opacity={fillOpacity}
        depthWrite={false}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

export default Polygon3D;
