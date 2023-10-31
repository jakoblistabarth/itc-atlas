import { useTexture } from "@react-three/drei";
import { FC } from "react";

type Props = {
  textureFileName: string;
};

const TextureMaterial: FC<Props> = ({ textureFileName }) => {
  const texture = useTexture(`/images/${textureFileName}`);

  return <meshStandardMaterial map={texture} />;
};

export default TextureMaterial;
