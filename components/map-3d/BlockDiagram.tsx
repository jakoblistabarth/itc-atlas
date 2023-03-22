import { FC, useEffect, useRef } from "react";
import { BufferAttribute, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import * as THREE from "three";
import { generateColorPalette, hsl2rgb } from "./BlockDiagramStyle/color";
import * as FXRand from "./BlockDiagramStyle/random";
type Props = {
  side: number;
  segments: number;
  yScale: number;
  data: Float32Array;
  zOffset?: number;
};

const features = {
  Palette: FXRand.choice(["Black&White", "Mono", "Analogous", "Complementary"]),
  Layer: FXRand.bool(0.2) ? 1 : FXRand.int(2, 3),
};
const colors = generateColorPalette(features);
const surfaceColor = hsl2rgb(colors[1][0], colors[1][1], colors[1][2]);
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
    uColor: {
      value: new THREE.Vector3(
        surfaceColor[0],
        surfaceColor[1],
        surfaceColor[2]
      ),
    },
  };

  const vertexShader = /*glsl*/ `
  attribute float displacement;
  varying vec3 vVertex;

  void main() {
    vec3 p = position;
    if ( p.x < 2. && p.x > -2. && p.y < 2. && p.y > -2. ) { 
       p = p + vec3(0,0,${zOffset.toFixed(6)} + displacement * ${yScale.toFixed(
    6
  )});
    }
    vVertex = ( modelViewMatrix * vec4(p, 1. ) ).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  }
  `;

  // TODO: remove random color (introduced for debugging)
  const fragmentShader = /*glsl*/ `
  uniform vec3 uColor;
  varying vec3 vVertex;
  
  void main() {
    vec3 N = normalize( cross( dFdx( vVertex ), dFdy( vVertex ) ) );

    // arbitrary direction of the light
    const vec3 lightDir = vec3( 1., 0., -1. );

    vec3 L = normalize( lightDir );
    vec3 diffuse = uColor * max( dot( N, -L ), 0.0 );

    gl_FragColor = vec4( diffuse, 1.0 );
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
