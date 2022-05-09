import { FC } from "react";

const ShadowLayer: FC<{
  geoPath: string;
  blur: number;
  color: string;
}> = ({ geoPath, blur, color }) => {
  return (
    <g>
      <defs>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="sourceAlpha" stdDeviation={blur} />
        </filter>
      </defs>
      <path fill={color} d={geoPath} filter="url(#f1)" />)
    </g>
  );
};

export default ShadowLayer;
