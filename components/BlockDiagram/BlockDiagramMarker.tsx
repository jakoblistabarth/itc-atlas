import { FC } from "react";
import { TextureLoader } from "three";
import usePosition from "./usePosition.hook";

type Props = {
  textureFileName: string;
  latitude: number;
  longitude: number;
};
const BlockDiagramMarker: FC<Props> = ({
  textureFileName,
  latitude,
  longitude,
}) => {
  const texture = new TextureLoader().load(`/images/${textureFileName}`);
  const markerHeight = 0.03;

  const { x, y, z } = usePosition(longitude, latitude);

  return (
    <>
      <mesh position={[x, y + markerHeight / 2, z]} castShadow>
        <cylinderGeometry args={[0.03, 0, markerHeight, 32, 32, false]} />
        <meshStandardMaterial attach="material-0" color={"white"} />
        <meshStandardMaterial
          attach="material-1"
          map={texture}
          roughness={0.2}
        />
      </mesh>
    </>
  );
};
export default BlockDiagramMarker;
