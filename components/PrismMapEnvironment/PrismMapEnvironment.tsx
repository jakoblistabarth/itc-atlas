import { AccumulativeShadows, Environment } from "@react-three/drei";
import { FC } from "react";
import SoftLight from "../SoftLight";

const PrismaMapEnvironment: FC = () => {
  return (
    <>
      <Environment preset="apartment" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2.5}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        castShadow
        shadow-bias={-0.0001}
      />
      <AccumulativeShadows frames={0} opacity={0.025}>
        <SoftLight position={[10, 10, 5]} />
      </AccumulativeShadows>
    </>
  );
};
export default PrismaMapEnvironment;
