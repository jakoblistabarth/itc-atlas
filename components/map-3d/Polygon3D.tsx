import { FC, useEffect, useState } from "react";
import { Color, DoubleSide, ExtrudeGeometryOptions, Shape } from "three";

const Polygon3D: FC<{
  shape: Shape | Shape[];
  color: string;
  fillOpacity: number;
  extrudeGeometryOptions: ExtrudeGeometryOptions;
}> = ({ shape, color, fillOpacity, extrudeGeometryOptions = {} }) => {
  const [hover, setHover] = useState(false);

  useEffect(
    () => void (document.body.style.cursor = hover ? `pointer` : `auto`),
    [hover]
  );

  return (
    <mesh
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      rotation={[Math.PI,0,0,]} // taking into account the origin of svg coordinates in the top left rather than in the center
    >
      <extrudeGeometry args={[shape, { ...extrudeGeometryOptions }]} />
      <meshStandardMaterial
        color={hover ? new Color("grey") : new Color(color)}
        opacity={fillOpacity}
        depthWrite={true}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

export default Polygon3D;
