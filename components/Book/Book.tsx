import { animated, config, useSpring } from "@react-spring/three";
import { useCursor, useGLTF } from "@react-three/drei";
import { randomUniform } from "d3";
import { FC, memo, useMemo, useState } from "react";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";

type Props = {
  color?: string;
  wiggle?: boolean;
  thesisId?: string;
  active?: boolean;
  setActiveThesis?: (id?: string) => void;
} & JSX.IntrinsicElements["group"];

type GLTFResult = GLTF & {
  nodes: {
    Cover: THREE.Mesh;
    Pages: THREE.Mesh;
  };
  materials: object;
};

const paperMaterial = new MeshStandardMaterial({
  color: "white",
});

const Book: FC<Props> = ({
  color,
  thesisId,
  active = false,
  wiggle = false,
  setActiveThesis,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const { scale } = useSpring({
    scale: active ? 1.2 : hovered ? 1.05 : 1,
    config: config.wobbly,
  });
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const coverMaterial = new MeshStandardMaterial({ color });
  const { rotationY, positionX, positionZ } = useMemo(() => {
    return {
      positionX: randomUniform(-0.025, 0.025)(),
      positionZ: randomUniform(-0.025, 0.025)(),
      rotationY: (Math.PI / 2) * randomUniform(-0.05, 0.05)(),
    };
  }, []);
  return (
    <animated.group
      scale={scale}
      position-x={wiggle && positionX}
      position-z={wiggle && positionZ}
      rotation-y={wiggle && rotationY}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => (
        e.stopPropagation(), setActiveThesis && setActiveThesis(thesisId)
      )}
      {...rest}
      dispose={null}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cover.geometry}
        material={coverMaterial}
      />
      <mesh
        castShadow
        geometry={nodes.Pages.geometry}
        material={paperMaterial}
      />
    </animated.group>
  );
};

useGLTF.preload("/models/book-transformed.glb");

export default Book;

export const MemoizedBook = memo(Book);
