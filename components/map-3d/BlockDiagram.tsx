import { FC, useEffect, useMemo, useRef } from "react";
import { BufferAttribute, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";

type Props = {
  side: number;
  segments: number;
  yScale: number;
  data: Float32Array;
};

// TODO: refactor with react drei fiber's shaderMaterial for declarative uniforms: https://docs.pmnd.rs/react-three-fiber/tutorials/typescript#extend-usage
// for typing, see: https://docs.pmnd.rs/react-three-fiber/tutorials/typescript#extend-usage

// TODO: if shaders get more complex move shaders to separate files: https://github.com/glslify/glslify-loader

const BlockDiagramm: FC<Props> = ({ side, segments, data, yScale }) => {
  const vertexShader = /*glsl*/ `
  attribute float displacement;

  void main() {
    vec3 newPosition = position + vec3(0,0,displacement * ${yScale.toFixed(6)});
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  }
  `;

  // TODO: remove random color (introduced for debugging)
  const fragmentShader = /*glsl*/ `
  void main() {
    gl_FragColor = vec4(0.0, ${Math.random()}, ${Math.random()}, 1.0);
  }
  `;

  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null);
  const geomRef = useRef<PlaneGeometry>(null);

  useEffect(() => {
    geomRef.current?.setAttribute("displacement", new BufferAttribute(data, 1));
  });

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock } = state;
    meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={geomRef} args={[side, side, segments, segments]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe
        />
      </mesh>
    </>
  );
};

export default BlockDiagramm;
