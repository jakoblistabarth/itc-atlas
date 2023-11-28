import { scaleLinear } from "d3";
import { FC } from "react";
import { TextureLoader } from "three";
import useSWR from "swr";
import getElevation from "../../lib/data/getElevation";
import { useBlockDiagramContext } from "./BlockDiagramContext";

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

  const { side, yScale, zOffset, ratio, bBox } = useBlockDiagramContext();

  const widthRange = [-side / 2, side / 2];
  const heightRange = [(-side * (1 / ratio)) / 2, (side * (1 / ratio)) / 2];
  const scaleLng = scaleLinear().domain([bBox[1], bBox[3]]).range(widthRange);
  const scaleLat = scaleLinear().domain([bBox[2], bBox[0]]).range(heightRange);

  //TODO: add error handling (use error from useSWR)
  const { data: elevation } = useSWR<Awaited<ReturnType<typeof getElevation>>>(
    `/api/data/elevation?latitude=${latitude}&longitude=${longitude}`,
  );
  const z =
    elevation && typeof elevation === "number"
      ? elevation * yScale + zOffset + markerHeight / 2
      : markerHeight / 2;

  return (
    <>
      <mesh position={[scaleLng(longitude), z, scaleLat(latitude)]} castShadow>
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
