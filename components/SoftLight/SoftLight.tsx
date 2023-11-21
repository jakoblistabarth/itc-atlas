import { FC, useMemo } from "react";
import { Vector3 } from "three";

type Props = { position: [number, number, number]; radius?: number };

const SoftLight: FC<Props> = ({ position, radius = 1 }) => {
  const positions = useMemo(() => {
    const f = 1 * radius;
    const base = new Vector3(...position);
    const shifts = [
      [0, 0, 0],
      [f, 0, 0],
      [-f, 0, 0],
      [0, f, 0],
      [0, -f, 0],
      [0, 0, f],
      [0, 0, -f],
      [f, f, f],
      [-f, -f, -f],
    ].map(([x, y, z]) => new Vector3(x, y, z));
    return shifts.map((d) => base.clone().add(d));
  }, [position, radius]);
  return (
    <>
      {positions.map((position) => (
        <directionalLight
          key={position.toArray().join("-")}
          castShadow
          position={position}
        />
      ))}
    </>
  );
};

export default SoftLight;
