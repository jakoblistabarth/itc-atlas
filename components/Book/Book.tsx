import { MeshStandardMaterial } from "three";
import { animated, config, useSpring } from "@react-spring/three";
import { useCursor, useGLTF } from "@react-three/drei";
import { FC, useCallback, useState } from "react";
import { GLTF } from "three-stdlib";

type Props = {
  color?: string;
  handleClick: () => void;
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

const Book: FC<Props> = ({ color, handleClick, ...rest }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const [selected, setSelected] = useState(false);
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const coverMaterial = new MeshStandardMaterial({ color });
  const { scale } = useSpring({
    scale: selected ? 1.2 : hovered ? 1.05 : 1,
    config: config.wobbly,
  });
  const handleClickCallback = useCallback(() => handleClick(), [handleClick]);
  return (
    <animated.group
      {...rest}
      dispose={null}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => (
        e.stopPropagation(), setSelected(true), handleClickCallback()
      )}
      onPointerMissed={() => setSelected(false)}
      scale={scale}
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

useGLTF.preload("models/book-transformed.glb");

export default Book;
