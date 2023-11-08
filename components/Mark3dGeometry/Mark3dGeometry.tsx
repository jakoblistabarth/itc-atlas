import { FC, memo, useEffect, useState } from "react";
import { Color, DoubleSide, ExtrudeGeometryOptions, Shape } from "three";

const Mark3dGeometry: FC<{
  shape: Shape | Shape[];
  color: string;
  fillOpacity: number;
  extrudeGeometryOptions: ExtrudeGeometryOptions;
  isActive?: boolean;
  onPointerDownHandler?: () => void;
}> = ({
  shape,
  color,
  fillOpacity,
  extrudeGeometryOptions = {},
  isActive = false,
  onPointerDownHandler,
}) => {
  const [hover, setHover] = useState(false);

  useEffect(
    () => void (document.body.style.cursor = hover ? `pointer` : `auto`),
    [hover],
  );

  return (
    <mesh
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e) => (
        e.stopPropagation(), onPointerDownHandler && onPointerDownHandler()
      )}
      castShadow
      receiveShadow
      scale-y={-1} // taking into account the origin of svg coordinates in the top left rather than in the center
    >
      <extrudeGeometry args={[shape, { ...extrudeGeometryOptions }]} />
      <meshStandardMaterial
        color={
          isActive && hover
            ? new Color("darkblue")
            : isActive
            ? new Color("blue")
            : hover
            ? new Color("grey")
            : new Color(color)
        }
        opacity={fillOpacity}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

export default Mark3dGeometry;

export const MemoizedMark3dGeometry = memo(Mark3dGeometry);
