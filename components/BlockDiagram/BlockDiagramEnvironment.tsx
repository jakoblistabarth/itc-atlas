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
    <pointLight
      position={[1, 3, -2]}
      shadow-mapSize={64 * 2 ** 6}
      castShadow
      intensity={2}
    />
    <hemisphereLight intensity={0.2} />
    <AccumulativeShadows scale={4}>
      <RandomizedLight
        amount={10}
        mapSize={64 * 2 ** 6}
        position={[2, 3, -6]}
        radius={1}
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
        width={2.5} // Width of the full cloud
        depth={0.25} // Z-dir depth
        segments={10} // Number of particles
      />
    ))}
  </>
);

export default BlockDiagramEnvironment;
