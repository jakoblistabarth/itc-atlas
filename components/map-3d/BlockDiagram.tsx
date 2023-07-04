import { FC, useEffect, useRef } from "react";
import { BackSide, BufferAttribute, PlaneGeometry, TextureLoader } from "three";
import CustomLayer from "./CustomLayer";
import { LayerMaterial, Texture } from "lamina";

type Props = {
  name: string;
  side: number;
  ratio: number;
  segments: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};
const BlockDiagram: FC<Props> = ({
  name,
  side,
  ratio,
  segments,
  data,
  yScale,
  zOffset,
}) => {
  const geomRef = useRef<PlaneGeometry>(null);
  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });
  const texture = new TextureLoader().load("/images/" + name + ".png");
  const width = side;
  const height = side * (1 / ratio);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry
          ref={geomRef}
          args={[width, height, segments, segments]}
        />
        <LayerMaterial>
          <CustomLayer
            width={+width.toFixed(6)}
            height={+height.toFixed(6)}
            zOffset={zOffset}
            yScale={yScale}
          />
          <Texture map={texture} />
        </LayerMaterial>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height, segments, segments]} />
        <meshStandardMaterial side={BackSide} />
      </mesh>
    </>
  );
};
export default BlockDiagram;
