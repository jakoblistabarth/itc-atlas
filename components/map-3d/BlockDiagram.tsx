import { FC, useEffect, useRef } from "react";
import {
  BackSide,
  BufferAttribute,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Uniform,
} from "three";
import * as d3 from "d3";

type Props = {
  side: number;
  segments: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};

const BlockDiagramm: FC<Props> = ({
  side,
  segments,
  data,
  yScale,
  zOffset,
}) => {
  const min = d3.min(data) ?? 0;
  const range = (d3.max(data) ?? 1) - min;
  const uniforms = {
    Diff: new Uniform(range),
    Min: new Uniform(min),
  };
  const sideHalf = (side / 2).toFixed(6);

  const vertexShader = /*glsl*/ `
  attribute highp float displacement;
  varying vec3 vVertex;
  varying highp float height;
  varying vec2 XY;
  void main() {
    vec3 p = position;
    if ( p.x < ${sideHalf} && p.x > -${sideHalf} && p.y < ${sideHalf} && p.y > -${sideHalf} ) {
      p = p + vec3(0,0,${zOffset?.toFixed(6)} + displacement * ${yScale.toFixed(
    6
  )});
    }
    height=displacement;
    vVertex = ( modelViewMatrix * vec4(p, 1. ) ).xyz;
    XY=p.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
  `;

  const fragmentShader = /*glsl*/ `
  varying vec3 vVertex;
  varying highp float height;
  varying vec2 XY;
  uniform highp float Diff;
  uniform highp float Min;
  void main() {
    vec3 Color=vec3(1.0-(height-Min)/Diff,0.9,0.0);
    if(height<0.0){
       Color=vec3(1.0-(height-Min)/Diff,0.2,(height-Min)/Diff);
    }
    if(height<1.0&&height>=0.0){
       Color=vec3((height-Min)/Diff,0.9,0.9);
    }
    if(height<3.2&&height>=1.0){
       Color=vec3(1.0,0.9,1.0-(height-Min)/Diff);
    }
    if(height<3.65&&height>=3.2){
       Color=vec3(0.7,0.9,(height-Min)/Diff);
    }
    if(height<4.76&&height>=3.65){
       Color=vec3(0.0,0.8,(height-Min)/Diff);
    }
    //Assign same color to 4 sides
    if ( XY.x == ${sideHalf} || XY.x == -${sideHalf} || XY.y == ${sideHalf} || XY.y == -${sideHalf} ) {
       Color=vec3(0.0,0.0,0.0);
    }
    //normal vector
     vec3 N = normalize( cross( dFdx( vVertex ), dFdy( vVertex ) ) );
    // arbitrary direction of the light
     const vec3 lightDir = vec3( 1., 0., -1. );
     vec3 L = normalize( lightDir );
     vec3 diffuse = Color * max( dot( N, -L ), 0.0 );
     gl_FragColor = vec4(diffuse, 1.0 );
  }
  `;

  const geomRef = useRef<PlaneGeometry>(null);
  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geomRef} args={[side, side, segments, segments]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[side, side, segments, segments]} />
        <meshStandardMaterial side={BackSide} />
      </mesh>
    </>
  );
};

export default BlockDiagramm;
