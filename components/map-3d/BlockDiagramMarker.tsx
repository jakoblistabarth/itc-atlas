import { FC } from "react";
import { TextureLoader } from "three";
type Props = {
  name: string;
  latitude: number;
  longitude: number;
  yScale: number;
  gridSize:number;
  zOffset: number;
  height: number[];
  bBox:number[];
};
const BlockDiagramMarker: FC<Props> = ({
  name,
  latitude,
  longitude,
  yScale,
  gridSize,
  zOffset,
  height,
  bBox,
}) => {
  var texture=new TextureLoader().load("/images/"+name+".jpg");
  const stepLat = Math.abs(bBox[2] - bBox[0]) / gridSize;
  const stepLng = Math.abs(bBox[3] - bBox[1]) / gridSize;
  const position_y = Math.round((latitude - bBox[0]) / stepLat);
  const position_x = Math.round((longitude - bBox[1]) / stepLng);
  const step_xy = 4 / gridSize;
  const Marker_height = height[gridSize * (position_y - 1) + position_x];
  return (
    <>
      <mesh
        position={[
          -2 + step_xy * position_x,
          Marker_height * yScale + zOffset,
          -2 + step_xy * position_y,
        ]}
      >
        <cylinderGeometry args={[0.08, 0.01, 0.05, 64, 64, false]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
export default BlockDiagramMarker;
