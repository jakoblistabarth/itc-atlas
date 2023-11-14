import { Html, useCursor } from "@react-three/drei";
import { FC, memo, useRef, useState } from "react";
import {
  Color,
  DoubleSide,
  ExtrudeGeometry,
  ExtrudeGeometryOptions,
  Shape,
  Vector3,
} from "three";

const Mark3dGeometry: FC<{
  label?: string;
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
  label,
  onPointerDownHandler,
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const extrudeGeometryRef = useRef<ExtrudeGeometry>(null);

  extrudeGeometryRef.current?.computeBoundingBox();
  const tooltipPosition = extrudeGeometryRef.current?.boundingBox
    ?.getCenter(new Vector3())
    .add(new Vector3(0, 0, 0.5));

  return (
    <mesh
      onPointerEnter={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={(e) => (
        e.stopPropagation(), onPointerDownHandler && onPointerDownHandler()
      )}
      castShadow
      receiveShadow
      position-z={isActive && 0.025}
      scale-y={-1} // taking into account the origin of svg coordinates in the top left rather than in the center
    >
      <extrudeGeometry
        ref={extrudeGeometryRef}
        args={[shape, { ...extrudeGeometryOptions }]}
      />
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
      {label && hovered && (
        <Html className="pointer-events-none" center position={tooltipPosition}>
          <div className="rounded-md bg-white p-2 text-xs shadow">{label}</div>
        </Html>
      )}
    </mesh>
  );
};

export default Mark3dGeometry;

export const MemoizedMark3dGeometry = memo(Mark3dGeometry);
