import { scaleLinear } from "d3";
import { FC } from "react";
import { TextureLoader } from "three";
import useSWR from "swr";
import getElevation from "../../lib/data/getElevation";

type Props = {
  name: string;
  latitude: number;
  longitude: number;
  yScale: number;
  zOffset: number;
  side: number;
  ratio: number;
  /**
   * Bounding Box according to geojson Specification
   * See: {@link https://datatracker.ietf.org/doc/html/rfc7946#section-5}
   * The value of the bbox member MUST be an array of
   * length 2*n where n is the number of dimensions represented in the
   * contained geometries, with all axes of the most southwesterly point
   * followed by all axes of the more northeasterly point.
   */
  bBox: [number, number, number, number];
};
const BlockDiagramMarker: FC<Props> = ({
  name,
  latitude,
  longitude,
  yScale, // blockDiagram meta
  zOffset, // blockDiagram meta
  side, // blockDiagram meta
  ratio, // blockDiagram meta
  bBox, // blockDiagram meta
}) => {
  const texture = new TextureLoader().load("/images/" + name + ".jpg");
  const markerHeight = 0.05;

  const widthRange = [-side / 2, side / 2];
  const heightRange = [(-side * (1 / ratio)) / 2, (side * (1 / ratio)) / 2];
  const scaleLng = scaleLinear().domain([bBox[1], bBox[3]]).range(widthRange);
  const scaleLat = scaleLinear().domain([bBox[2], bBox[0]]).range(heightRange);

  //TODO: add error handling (use error from useSWR)
  const { data: elevation } = useSWR<Awaited<ReturnType<typeof getElevation>>>(
    `/api/data/elevation?latitude=${latitude}&longitude=${longitude}`
  );
  const z =
    elevation && typeof elevation === "number"
      ? elevation * yScale + zOffset + markerHeight / 2
      : markerHeight / 2;

  return (
    <>
      <mesh position={[scaleLng(longitude), z, scaleLat(latitude)]} castShadow>
        <cylinderGeometry args={[0.08, 0, markerHeight, 32, 32, false]} />
        <meshStandardMaterial attach="material-0" color={"white"} />
        <meshStandardMaterial attach="material-1" map={texture} />
      </mesh>
    </>
  );
};
export default BlockDiagramMarker;
