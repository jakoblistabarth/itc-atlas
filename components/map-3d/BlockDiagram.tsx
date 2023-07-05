import { FC, useEffect, useRef } from "react";
import { BackSide, BufferAttribute, PlaneGeometry, TextureLoader } from "three";
import CustomLayer from "./CustomLayer";
import { LayerMaterial, Texture } from "lamina";
import BlockDiagramSide from "./BlockDiagramSide";

type Props = {
  textureFileName: string;
  sideColor?: string;
  side: number;
  ratio: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};
const BlockDiagram: FC<Props> = ({
  textureFileName,
  sideColor = "white",
  side,
  ratio,
  data,
  yScale,
  zOffset,
}) => {
  const geomRef = useRef<PlaneGeometry>(null);
  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });

  const vertices = Math.sqrt(data.length);
  const segments = vertices - 1;

  const texture = new TextureLoader().load(`/images/${textureFileName}`);

  const width = side;
  const height = side * (1 / ratio);

  const heightValues = Array.from(data);
  const sides = {
    back: heightValues.slice(0, vertices).reverse(),
    right: heightValues
      .filter((_, i) => i !== 0 && (i + vertices + 1) % vertices === 0)
      .reverse(),
    front: heightValues.slice(data.length - vertices, data.length),
    left: heightValues.filter(
      (_, i) => i % vertices === 0 && i + 1 !== data.length
    ),
  };

  return (
    <>
      <mesh castShadow position={[0, 0.005, 0]}>
        <boxGeometry args={[width * 0.999, 0.01, height * 0.999, 1, 1]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <planeGeometry
          ref={geomRef}
          args={[width, height, segments, segments]}
        />
        <LayerMaterial lighting="lambert">
          <CustomLayer
            width={+width.toFixed(6)}
            height={+height.toFixed(6)}
            zOffset={zOffset}
            yScale={yScale}
          />
          <Texture map={texture} />
        </LayerMaterial>
      </mesh>
      <BlockDiagramSide
        heightValues={sides.back}
        yScale={yScale}
        zOffset={zOffset}
        length={width}
        position-z={-height / 2}
        rotation-y={Math.PI}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.right}
        yScale={yScale}
        zOffset={zOffset}
        length={height}
        position-x={width / 2}
        rotation-y={Math.PI / 2}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.left}
        yScale={yScale}
        zOffset={zOffset}
        length={height}
        position-x={width / -2}
        rotation-y={Math.PI / -2}
        color={sideColor}
      />
      <BlockDiagramSide
        heightValues={sides.front}
        yScale={yScale}
        zOffset={zOffset}
        length={width}
        position-z={height / 2}
        rotation-y={2 * Math.PI}
        color={sideColor}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height, segments, segments]} />
        <meshStandardMaterial side={BackSide} />
      </mesh>
    </>
  );
};
export default BlockDiagram;
