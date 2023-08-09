import { range } from "d3";
import { FC, SVGProps } from "react";

type Props = {
  radius: number;
  sides: number;
} & SVGProps<SVGPolygonElement>;

const NsidedPolygon: FC<Props> = ({ sides, radius, ...rest }) => {
  const stepSize = (2 * Math.PI) / sides;
  const offset = Math.PI / -2;
  const points = range(0, sides)
    .map((_, idx) => {
      const angle = offset + stepSize * idx;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return `${x}, ${y}`;
    })
    .join(" ");
  return <polygon {...rest} points={points} {...rest} />;
};

export default NsidedPolygon;
