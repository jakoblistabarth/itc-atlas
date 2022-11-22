import { range } from "d3";
import { FC, SVGProps } from "react";

type Props = {
  rays?: number;
  innerRadius: number;
  outerRadius: number;
} & SVGProps<SVGPolygonElement>;

const Star: FC<Props> = ({ rays = 5, innerRadius, outerRadius, ...rest }) => {
  const stepSize = (2 * Math.PI) / rays;
  const offset = Math.PI / -2;
  const points = range(0, rays)
    .map((_, idx) => {
      const outerAngle = offset + stepSize * idx;
      const innerAngle = offset + stepSize / 2 + stepSize * idx;
      const xO = Math.cos(outerAngle) * outerRadius;
      const yO = Math.sin(outerAngle) * outerRadius;
      const xI = Math.cos(innerAngle) * innerRadius;
      const yI = Math.sin(innerAngle) * innerRadius;
      return `${xO}, ${yO} ${xI},${yI}`;
    })
    .join(" ");
  return <polygon {...rest} points={points} {...rest} />;
};

export default Star;
