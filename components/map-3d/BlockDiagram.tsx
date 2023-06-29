import { FC, useEffect, useRef } from "react";
import { BackSide, BufferAttribute, PlaneGeometry, TextureLoader } from "three";
import CustomLayer from "./CustomLayer";
import { LayerMaterial, Texture } from "lamina";

type Props = {
  name: string;
  side: number;
  segments: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};
const BlockDiagram: FC<Props> = ({
  name,
  side,
  segments,
  data,
  yScale,
  zOffset,
}) => {
  const sideHalf = +(side / 2).toFixed(6);
  const geomRef = useRef<PlaneGeometry>(null);
  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });
  const texture = new TextureLoader().load("/images/" + name + ".png");
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geomRef} args={[side, side, segments, segments]} />
        <LayerMaterial>
          <CustomLayer sideHalf={sideHalf} zOffset={zOffset} yScale={yScale} />
          <Texture map={texture} />
        </LayerMaterial>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[side, side, segments, segments]} />
        <meshStandardMaterial side={BackSide} />
      </mesh>
    </>
  );
};
export default BlockDiagram;
