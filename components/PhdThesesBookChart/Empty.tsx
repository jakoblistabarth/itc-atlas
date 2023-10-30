import { MeshTransmissionMaterial } from "@react-three/drei";
import { FC, memo } from "react";

const Empty: FC<JSX.IntrinsicElements["group"]> = ({ ...rest }) => (
  <group {...rest}>
    <mesh rotation-x={Math.PI / -2} position={0.0125} rotation-z={Math.PI / 2}>
      <boxGeometry args={[0.21, 0.297, 0.025]} />
      <MeshTransmissionMaterial
        distortionScale={0.3}
        temporalDistortion={0.5}
        roughness={0}
        color={"blue"}
        attenuationDistance={0.5}
        opacity={0.2}
        transparent
        attenuationColor={"lightblue"}
      />
    </mesh>
  </group>
);

export default Empty;

export const MemoizedEmpty = memo(Empty);
