import { Line } from "@react-three/drei";
import { range } from "d3";
import { ComponentProps, FC } from "react";
import { Vector3 } from "three";

type Props = {
  side: number;
  color: string;
  lineWidth: number;
} & ComponentProps<"group">;

const PlaneOutline: FC<Props> = ({ side, color, lineWidth, ...rest }) => {
  const points = range(5).map((i) =>
    new Vector3(side / 2, 0, side / 2).applyAxisAngle(
      new Vector3(0, 1, 0),
      (Math.PI / 2) * i
    )
  );

  return (
    <group {...rest}>
      <Line points={points} color={color} lineWidth={lineWidth} />
    </group>
  );
};

export default PlaneOutline;
