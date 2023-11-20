import { ScalePower } from "d3";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
import { FC, memo } from "react";
import { Vector3 } from "three";

type Props = {
  events: (SpaceTimeCubeEvent & { pos: Vector3 })[];
  scale: ScalePower<number, number>;
};

const SpaceTimeCubeEvents: FC<Props> = ({ events, scale }) => {
  return (
    <>
      {events.map((e, idx) => (
        <mesh key={`${e.name}-${idx}`} position={e.pos}>
          <sphereGeometry args={[e.size ? scale(e.size) / 2 : 0]} />
          <meshPhysicalMaterial color="teal" roughness={0.2} />
        </mesh>
      ))}
    </>
  );
};

export default SpaceTimeCubeEvents;

export const MemoizedSpaceTimeCubeEvents = memo(SpaceTimeCubeEvents);
