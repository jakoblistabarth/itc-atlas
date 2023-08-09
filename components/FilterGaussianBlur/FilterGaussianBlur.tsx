import { FC } from "react";

const FilterGaussianBlur: FC<{ id: string; blur?: number }> = ({
  id,
  blur = 10,
}) => {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="sourceAlpha" stdDeviation={blur} />
    </filter>
  );
};

export default FilterGaussianBlur;
