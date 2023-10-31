import { FC } from "react";
import { MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { fragmentShader, vertexShader } from "./BlockDiagram.helpers";

const HyposmetricTintMaterial: FC = () => {
  return (
    <CustomShaderMaterial
      baseMaterial={new MeshStandardMaterial({ color: "white" })}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
};

export default HyposmetricTintMaterial;
