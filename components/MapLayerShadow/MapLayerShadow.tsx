import { FC, SVGProps } from "react";
import GaussianBlur from "../FilterGaussianBlur";

type Props = {
  geoPath: string;
  blur: number;
  color: string;
} & SVGProps<SVGGElement>;

const ShadowLayer: FC<Props> = ({ geoPath, blur = 30, color, ...rest }) => {
  const filterId = "blurFilter";
  return (
    <g {...rest}>
      <defs>
        <GaussianBlur id={filterId} blur={blur} />
      </defs>
      <path fill={color} d={geoPath} filter={`url(#${filterId})`} />)
    </g>
  );
};

export default ShadowLayer;
