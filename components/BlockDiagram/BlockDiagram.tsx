import { BBox } from "geojson";
import { FC, PropsWithChildren } from "react";
import { BufferAttribute, PlaneGeometry } from "three";
import sliceIntoChunks from "../../lib/utilities/sliceIntoChunks";
import { BlockDiagramContext } from "./BlockDiagramContext";
import BlockDiagramSide from "./BlockDiagramSide";
import HyposmetricTintMaterial from "./HypsometricTintMaterial";
import TextureMaterial from "./TextureMaterial";

type Props = PropsWithChildren<{
  textureFileName?: string;
  sideColor?: string;
  side: number;
  ratio: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
  /**
   * Bounding Box according to geojson Specification
   * See: {@link https://datatracker.ietf.org/doc/html/rfc7946#section-5}
   * The value of the bbox member MUST be an array of
   * length 2*n where n is the number of dimensions represented in the
   * contained geometries, with all axes of the most southwesterly point
   * followed by all axes of the more northeasterly point.
   */
  bBox: BBox;
}>;

const BlockDiagram: FC<Props> = ({
  textureFileName,
  sideColor = "white",
  side,
  ratio,
  data,
  yScale,
  zOffset = 0.25,
  bBox,
  children,
}) => {
  const vertices = Math.sqrt(data.length);
  const segments = vertices - 1;

  const width = side;
  const depth = side * (1 / ratio);

  const heightValues = Array.from(data);

  const topGeometry = new PlaneGeometry(width, depth, segments, segments);
  const position = topGeometry.getAttribute("position");
  const positions = sliceIntoChunks(
    Array.from(position.array),
    position.itemSize,
  );
  const displacedPositions = positions.map(([x, y], i) => [
    x,
    y,
    (zOffset ?? 0) + heightValues[i] * yScale,
  ]);
  topGeometry.setAttribute(
    "position",
    new BufferAttribute(Float32Array.from(displacedPositions.flat()), 3),
  );
  topGeometry.setAttribute("displacement", new BufferAttribute(data, 1));
  topGeometry.computeVertexNormals();

  const sides = {
    back: heightValues.slice(0, vertices).reverse(),
    right: heightValues
      .filter((_, i) => i !== 0 && (i + vertices + 1) % vertices === 0)
      .reverse(),
    front: heightValues.slice(data.length - vertices, data.length),
    left: heightValues.filter(
      (_, i) => i % vertices === 0 && i + 1 !== data.length,
    ),
  };

  return (
    <BlockDiagramContext.Provider
      value={{ yScale, zOffset, side, ratio, bBox }}
    >
      <mesh
        rotation-x={-Math.PI / 2}
        geometry={topGeometry}
        receiveShadow
        castShadow
      >
        {textureFileName ? (
          <TextureMaterial textureFileName={textureFileName} />
        ) : (
          <HyposmetricTintMaterial />
        )}
      </mesh>
      <mesh castShadow position-y={0.005}>
        <boxGeometry args={[width * 0.999, 0.01, depth * 0.999, 1, 1]} />
        <meshStandardMaterial color={sideColor} />
      </mesh>
      <BlockDiagramSide
        heightValues={sides.back}
        yScale={yScale}
        zOffset={zOffset}
        length={width}
        position-z={-depth / 2}
        rotation-y={Math.PI}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.right}
        yScale={yScale}
        zOffset={zOffset}
        length={depth}
        position-x={width / 2}
        rotation-y={Math.PI / 2}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.left}
        yScale={yScale}
        zOffset={zOffset}
        length={depth}
        position-x={width / -2}
        rotation-y={Math.PI / -2}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.front}
        yScale={yScale}
        zOffset={zOffset}
        length={width}
        position-z={depth / 2}
        rotation-y={2 * Math.PI}
        color={sideColor}
      />
      {children}
    </BlockDiagramContext.Provider>
  );
};
export default BlockDiagram;
