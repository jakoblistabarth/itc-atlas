import { FC } from "react";
import GaussianBlur from "../defs/filter/GaussianBlur";

const ShadowLayer: FC<{
  geoPath: string;
  blur: number;
  color: string;
}> = ({ geoPath, blur, color }) => {
  const filterId = "blurFilter";
  return (
    <g>
      <defs>
        <GaussianBlur id={filterId} blur={100} />
      </defs>
      <path fill={color} d={geoPath} filter={`url(#${filterId})`} />)
    </g>
  );
};

export default ShadowLayer;
