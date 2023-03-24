import { FC, useEffect, useRef } from "react";
import { BufferAttribute, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import json from "../../data/topographic/elevation-Paramaribo.json";

type Props = {
  side: number;
  segments: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};
var ele = json.elevation;
//var scale_b = d3.scaleBand().domain(ele).range([0, 1]);
var compare = function (x, y) {
  //比较函数
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
};
ele.sort(compare);
const min = ele[0];
const minus = ele[ele.length - 1] - ele[0];
// TODO: refactor with react drei fiber's shaderMaterial for declarative uniforms: https://docs.pmnd.rs/react-three-fiber/tutorials/typescript#extend-usage
// for typing, see: https://docs.pmnd.rs/react-three-fiber/tutorials/typescript#extend-usage

// TODO: if shaders get more complex move shaders to separate files: https://github.com/glslify/glslify-loader

const BlockDiagramm: FC<Props> = ({
  side,
  segments,
  data,
  yScale,
  zOffset,
}) => {
  const uniforms = {
    Diff: minus,
    Min: min,
  };

  const sideHalf = (side / 2).toFixed(6);
  const vertexShader = /*glsl*/ `
  attribute highp float displacement;
  varying vec3 vVertex;
  varying highp float sVertex;
  void main() {
    vec3 p = position;
    if ( p.x < ${sideHalf} && p.x > -${sideHalf} && p.y < ${sideHalf} && p.y > -${sideHalf} ) {
      p = p + vec3(0,0,${zOffset?.toFixed(6)} + displacement * ${yScale.toFixed(
    6
  )});
    }
    sVertex=displacement;
    vVertex = ( modelViewMatrix * vec4(p, 1. ) ).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  }
  `;

  // TODO: remove random color (introduced for debugging)
  const fragmentShader = /*glsl*/ `
  varying vec3 vVertex;
  varying highp float sVertex;
  uniform highp float Diff;
  uniform highp float Min;
  void main() {
    vec3 Color=vec3(1.0-(sVertex-Min)/Diff,0.9,0.0);
    if(sVertex<0.0){
       Color=vec3(1.0-(sVertex-Min)/Diff,0.2,(sVertex-Min)/Diff);
    }
    if(sVertex<1.0&&sVertex>=0.0){
       Color=vec3((sVertex-Min)/Diff,0.9,0.9);
    }
    if(sVertex<3.2&&sVertex>=1.0){
       Color=vec3(1.0,0.9,1.0-(sVertex-Min)/Diff);
    }
    if(sVertex<3.65&&sVertex>=3.2){
       Color=vec3(0.7,0.9,(sVertex-Min)/Diff);
    }
    if(sVertex<4.76&&sVertex>=3.65){
       Color=vec3(0.0,0.8,(sVertex-Min)/Diff);
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

  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null);
  const geomRef = useRef<PlaneGeometry>(null);

  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geomRef} args={[side, side, segments, segments]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};

export default BlockDiagramm;
