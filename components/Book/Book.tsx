import React, { FC, memo, useMemo, useState } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { MeshStandardMaterial } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { randomUniform } from "d3";

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
      {...rest}
      scale={scale}
      dispose={null}
      position-x={wiggle && positionX}
      position-z={wiggle && positionZ}
      rotation-y={wiggle && rotationY}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => (
        e.stopPropagation(), setActiveThesis && setActiveThesis(thesisId)
      )}
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
