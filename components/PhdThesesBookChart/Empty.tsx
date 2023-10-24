import { FC, memo } from "react";

const Empty: FC<JSX.IntrinsicElements["group"]> = ({ ...rest }) => (
  <group {...rest}>
    <mesh rotation-x={Math.PI / -2}>
      <planeGeometry args={[0.21, 0.297]} />
      <meshStandardMaterial color={"lightgrey"} opacity={0.2} transparent />
    </mesh>
  </group>
);

export default Empty;

export const MemoizedEmpty = memo(Empty);
