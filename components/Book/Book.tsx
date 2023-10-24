import React, { FC, memo, useMemo, useState } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { MeshStandardMaterial } from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { randomUniform } from "d3";

type Props = {
  color?: string;
  wiggle?: boolean;
  title: string;
  active: boolean;
  setActiveThesis?: (id: string) => void;
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
  title,
  active = false,
  wiggle = false,
  setActiveThesis,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const { scale } = useSpring({
    scale: active ? 1.1 : hovered ? 1.05 : 1,
    config: config.wobbly,
  });
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const coverMaterial = new MeshStandardMaterial({ color });
  const { rotationY, positionX, positionZ } = useMemo(() => {
    const random = randomUniform(-0.05, 0.05)();
    return {
      positionX: random / 2,
      positionZ: -random / 2,
      rotationY: (Math.PI / 2) * random,
    };
  }, []);
  return (
    <animated.group
      {...rest}
      scale={scale}
      dispose={null}
      rotation-y={wiggle && rotationY}
      position-x={wiggle && positionX}
      position-z={wiggle && positionZ}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => (
        e.stopPropagation(), setActiveThesis && setActiveThesis(title)
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
