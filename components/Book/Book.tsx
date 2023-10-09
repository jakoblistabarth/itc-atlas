import React, { FC, useState } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { MeshStandardMaterial } from "three";

type Props = { color?: string } & JSX.IntrinsicElements["group"];

type GLTFResult = GLTF & {
  nodes: {
    Cover: THREE.Mesh;
    Pages: THREE.Mesh;
  };
};

const paperMaterial = new MeshStandardMaterial({
  color: "white",
});

const Book: FC<Props> = ({ color, ...rest }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const coverMaterial = new MeshStandardMaterial({ color });
  return (
    <group
      {...rest}
      dispose={null}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
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
    </group>
  );
};

useGLTF.preload("/models/book-transformed.glb");

export default Book;
