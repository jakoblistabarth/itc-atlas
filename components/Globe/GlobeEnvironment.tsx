import { Environment, Stars } from "@react-three/drei";
import { useTheme } from "next-themes";

const GlobeEnvironment = () => {
  const { theme } = useTheme();

  return (
    <>
      <directionalLight castShadow position={[3, 3, 3]} />
      <Environment preset="dawn" />
      {theme === "dark" && <Stars />}
    </>
  );
};

export default GlobeEnvironment;
