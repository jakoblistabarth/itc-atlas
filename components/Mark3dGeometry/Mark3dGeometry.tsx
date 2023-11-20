import { useCursor } from "@react-three/drei";
import { FC, memo, useState } from "react";
import { Color, DoubleSide, ExtrudeGeometryOptions, Shape } from "three";

const Mark3dGeometry: FC<{
  shape: Shape | Shape[];
  color: string;
  fillOpacity: number;
  extrudeGeometryOptions: ExtrudeGeometryOptions;
  isActive?: boolean;
  onPointerEnterHandler?: () => void;
  onPointerLeaveHandler?: () => void;
  onPointerDownHandler?: () => void;
}> = ({
  shape,
  color,
  fillOpacity,
  extrudeGeometryOptions = {},
  isActive = false,
  onPointerEnterHandler,
  onPointerLeaveHandler,
  onPointerDownHandler,
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh
      onPointerEnter={(e) => (
        e.stopPropagation(),
        setHovered(true),
        onPointerEnterHandler && onPointerEnterHandler()
      )}
      onPointerLeave={() => (
        setHovered(false), onPointerLeaveHandler && onPointerLeaveHandler()
      )}
      onPointerDown={(e) => (
        e.stopPropagation(), onPointerDownHandler && onPointerDownHandler()
      )}
      castShadow
      receiveShadow
      position-z={isActive && 0.025}
      scale-y={-1} // taking into account the origin of svg coordinates in the top left rather than in the center
    >
      <extrudeGeometry args={[shape, { ...extrudeGeometryOptions }]} />
      <meshStandardMaterial
        color={
          isActive && hovered
            ? new Color("darkblue")
            : isActive
            ? new Color("blue")
            : hovered
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
