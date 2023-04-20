import { FC } from "react";
import { TextureLoader } from "three";
import * as Area from "../../data/static/blockdiagrammAreas.json";
type Props = {
  name: string;
  Latitude: number;
  Lontitude: number;
  yScale: number;
  zOffset: number;
  height: number[];
};
const BlockDiagrammMarker: FC<Props> = ({
  name,
  latitude,
  longitude,
  yScale,
  zOffset,
  height,
}) => {
  var location;
  var texture;
  if (name == "Par") {
    location = Area.areas[0].locations;
    texture = new TextureLoader().load("/images/sur.jpg");
  } else {
    location = Area.areas[1].locations;
    texture = new TextureLoader().load("/images/aus.jpg");
  }
  const lats = location.map((l) => l[0]);
  const lngs = location.map((l) => l[1]);
  const minLat = Math.min.apply(null, lats);
  const maxLat = Math.max.apply(null, lats);
  const minLng = Math.min.apply(null, lngs);
  const maxLng = Math.max.apply(null, lngs);
  const segments = 1000;
  const gridSize = segments + 1;
  const stepLat = Math.abs(maxLat - minLat) / gridSize;
  const stepLng = Math.abs(maxLng - minLng) / gridSize;
  const position_y = Math.round((Latitude - minLat) / stepLat);
  const position_x = Math.round((Lontitude - minLng) / stepLng);
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
export default BlockDiagrammMarker;
