import { FC, useLayoutEffect, useRef } from "react";
import { PlaneGeometry } from "three";

type Props = {
  heightValues: number[];
  length: number;
  yScale?: number;
  zOffset?: number;
  color?: string;
} & JSX.IntrinsicElements["mesh"];
const BlockDiagramSide: FC<Props> = ({
  heightValues,
  length,
  yScale = 1,
  zOffset = 0,
  color = "white",
  ...rest
}) => {
  const geometryRef = useRef<PlaneGeometry>(null);

  useLayoutEffect(() => {
    const geometry = geometryRef.current;
    if (geometry) {
      const positionAttr = geometry.attributes.position;
      for (let i = 1; i < positionAttr.count; i = i + 2) {
        const x = positionAttr.getX(i) + heightValues[(i - 1) / 2] * yScale;
        positionAttr.setXYZ(i, x, positionAttr.getY(i), positionAttr.getZ(i));
      }
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh
      position-y={zOffset / 2}
      rotation-z={Math.PI / 2}
      receiveShadow
      castShadow
      {...rest}
    >
      <planeGeometry
        ref={geometryRef}
        args={[zOffset, length, 1, heightValues.length - 1]}
      />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
export default BlockDiagramSide;
