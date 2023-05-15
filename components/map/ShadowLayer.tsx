import { FC, SVGProps } from "react";
import GaussianBlur from "../defs/filter/GaussianBlur";

type Props = {
  geoPath: string;
  blur: number;
  color: string;
} & SVGProps<SVGGElement>;

const ShadowLayer: FC<Props> = ({ geoPath, blur, color, ...rest }) => {
  const filterId = "blurFilter";
  return (
    <g {...rest}>
      <defs>
        <GaussianBlur id={filterId} blur={30} />
      </defs>
      <path fill={color} d={geoPath} filter={`url(#${filterId})`} />)
    </g>
  );
};

export default ShadowLayer;
