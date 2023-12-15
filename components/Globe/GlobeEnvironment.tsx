import { Environment } from "@react-three/drei";

const GlobeEnvironment = () => (
  <>
    <directionalLight castShadow position={[3, 3, 3]} />
    <Environment preset="dawn" />
  </>
);

export default GlobeEnvironment;
