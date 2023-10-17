import { ContactShadows } from "@react-three/drei";

const GlobeEnvironment = () => (
  <>
    <ambientLight args={["white", 1.5]} />
    <directionalLight castShadow position={[10, 10, 0]} args={["white", 2]} />
    <ContactShadows frames={1} opacity={0.2} blur={2} position={[0, -1.1, 0]} />
  </>
);

export default GlobeEnvironment;
