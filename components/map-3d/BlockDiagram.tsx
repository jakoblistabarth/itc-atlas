import { FC, useEffect, useRef } from "react";
import { BackSide, BufferAttribute, PlaneGeometry, Uniform } from "three";
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
    //Cold-humid regions
    float gradient[12]=float[12](-400.0,0.0,50.0,200.0,600.0,1000.0,2000.0,3000.0,4000.0,5000.0,6000.0,7000.0);
    vec3 Color;
    if(height<=(gradient[0]+gradient[1])/2.0){
       Color=vec3(112.0,147.0,141.0)/256.0;
    }
    if((gradient[0]+gradient[1])/2.0<height&&height<=(gradient[1]+gradient[2])/2.0){
       Color=vec3(120.0,159.0,152.0)/256.0;
    }
    if((gradient[1]+gradient[2])/2.0<height&&height<=(gradient[2]+gradient[3])/2.0){
      Color=vec3(130.0,165.0,159.0)/256.0;
    }
    if((gradient[2]+gradient[3])/2.0<height&&height<=(gradient[3]+gradient[4])/2.0){
      Color=vec3(145.0,177.0,171.0)/256.0;
    }
    if((gradient[3]+gradient[4])/2.0<height&&height<=(gradient[4]+gradient[5])/2.0){
      Color=vec3(180.0,192.0,180.0)/256.0;
    }
    if((gradient[4]+gradient[5])/2.0<height&&height<=(gradient[5]+gradient[6])/2.0){
      Color=vec3(212.0,201.0,180.0)/256.0;
    }
    if((gradient[5]+gradient[6])/2.0<height&&height<=(gradient[6]+gradient[7])/2.0){
      Color=vec3(212.0,184.0,163.0)/256.0;
    }
    if((gradient[6]+gradient[7])/2.0<height&&height<=(gradient[7]+gradient[8])/2.0){
      Color=vec3(212.0,193.0,179.0)/256.0;
    }
    if((gradient[7]+gradient[8])/2.0<height&&height<=(gradient[8]+gradient[9])/2.0){
      Color=vec3(212.0,207.0,204.0)/256.0;
    }
    if((gradient[8]+gradient[9])/2.0<height&&height<=(gradient[9]+gradient[10])/2.0){
      Color=vec3(220.0,220.0,220.0)/256.0;
    }
    if((gradient[9]+gradient[10])/2.0<height&&height<=(gradient[10]+gradient[11])/2.0){
      Color=vec3(235.0,235.0,237.0)/256.0;
    }
    if((gradient[10]+gradient[11])/2.0<height){
      Color=vec3(245.0,245.0,245.0)/256.0;
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
