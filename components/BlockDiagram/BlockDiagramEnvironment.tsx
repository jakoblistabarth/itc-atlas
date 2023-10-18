import {
  AccumulativeShadows,
  Cloud,
  OrbitControls,
  OrthographicCamera,
  RandomizedLight,
} from "@react-three/drei";

const BlockDiagramEnvironment = () => (
  <>
    <OrbitControls enablePan maxPolarAngle={Math.PI / 2.1} />
    <OrthographicCamera
      makeDefault
      rotation={[0, Math.PI, 0]}
      position={[-2, 3, 2]}
      zoom={250}
    />
    <directionalLight
      position={[1, 5, -2]}
      shadow-mapSize={64 * 2 ** 6}
      castShadow
      intensity={0.5}
    />
    <directionalLight
      position={[-3, 5, 2]}
      shadow-mapSize={64 * 2 ** 6}
      castShadow
      intensity={1}
    />
    <hemisphereLight intensity={1.5} />
    <AccumulativeShadows scale={4} opacity={0.5}>
      <RandomizedLight
        mapSize={64 * 2 ** 6}
        position={[3, 3, -8]}
        radius={10}
        castShadow
      />
    </AccumulativeShadows>
    {[
      [0.05, -0.3],
      [-0.3, 0.2],
      [0.4, 0.05],
    ].map(([x, z], i) => (
      <Cloud
        key={i}
        position={[x, 0.75, z]}
        scale={0.075}
        opacity={0.25}
        speed={0.2} // Rotation speed
        segments={10} // Number of particles
      />
    ))}
  </>
);

export default BlockDiagramEnvironment;
