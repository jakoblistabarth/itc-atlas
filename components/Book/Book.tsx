import React, { FC, useState } from "react";
import { Outlines, useCursor, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { DoubleSide, MeshStandardMaterial } from "three";

type Props = { color?: string } & JSX.IntrinsicElements["group"];

type GLTFResult = GLTF & {
  nodes: {
    Cover: THREE.Mesh;
    Pages: THREE.Mesh;
  };
};

const paperMaterial = new MeshStandardMaterial({
  color: "white",
  side: DoubleSide,
});

const Book: FC<Props> = ({ color, ...rest }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const coverMaterial = new MeshStandardMaterial({ color, side: DoubleSide });
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
      >
        <Outlines
          screenspace={false}
          toneMapped={false}
          transparent
          // polygonOffset
          // polygonOffsetFactor={0}
          opacity={0} // hovered ? 1 : 0
          color={"black"}
          angle={Math.PI} //default
          thickness={0.05} //default
        />
      </mesh>
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
