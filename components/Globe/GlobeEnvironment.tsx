import { ContactShadows } from "@react-three/drei";

const GlobeEnvironment = () => (
  <>
    <ambientLight args={["white", 0.3]} />
    <directionalLight
      castShadow
      position={[10, 10, 0]}
      args={["white", 0.75]}
    />
    <ContactShadows frames={1} opacity={0.2} blur={2} position={[0, -1.1, 0]} />
  </>
);

export default GlobeEnvironment;
